import { Role, UserStatus } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { isMockMode } from "@/lib/config";
import { mockStore } from "@/lib/mock/store";
import {
  authSessionMaxAgeSec,
  authSessionUpdateAgeSec,
  bumpUserSessionVersion,
  getClientIp,
} from "@/lib/auth/session-security";

function authCookieDomain(): string | undefined {
  if (process.env.NODE_ENV !== "production") return undefined;
  const fromEnv = process.env.NEXTAUTH_COOKIE_DOMAIN?.trim();
  if (fromEnv) return fromEnv;
  try {
    const base = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;
    if (!base) return undefined;
    const host = new URL(base).hostname;
    const parts = host.split(".").filter(Boolean);
    if (parts.length >= 2) {
      return `.${parts.slice(-2).join(".")}`;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: authSessionMaxAgeSec(),
    updateAge: authSessionUpdateAgeSec(),
  },
  pages: {
    signIn: "/login",
    signOut: "/signout",
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: (() => {
    const domain = authCookieDomain();
    if (!domain) return undefined;
    const secure = process.env.NODE_ENV === "production";
    const prefix = secure ? "__Secure-" : "";
    return {
      sessionToken: {
        name: `${prefix}next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure,
          domain,
        },
      },
      callbackUrl: {
        name: `${prefix}next-auth.callback-url`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure,
          domain,
        },
      },
      csrfToken: {
        name: `${secure ? "__Host-" : ""}next-auth.csrf-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure,
        },
      },
    };
  })(),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const normalizedEmail = email.toLowerCase();
        const loginIp = getClientIp(
          // NextAuth v4 passes a request-like object with headers
          (req as { headers?: Headers | Record<string, string | string[]> })
            ?.headers
        );

        if (isMockMode()) {
          const mockUser = mockStore.users.find(
            (u) => u.email === normalizedEmail
          );
          if (!mockUser || mockUser.password !== password) {
            return null;
          }
          if (mockUser.status === "SUSPENDED") {
            throw new Error("SUSPENDED_ACCOUNT");
          }
          const sessionVersion =
            ((mockUser as { sessionVersion?: number }).sessionVersion ?? 0) + 1;
          (mockUser as { sessionVersion?: number }).sessionVersion =
            sessionVersion;
          return {
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            role: mockUser.role,
            status: mockUser.status,
            sessionVersion,
            loginIp: loginIp ?? undefined,
          };
        }

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user) {
          return null;
        }

        if (user.status === "SUSPENDED") {
          throw new Error("SUSPENDED_ACCOUNT");
        }
        if (user.status === "LOCKED") {
          throw new Error("LOCKED_ACCOUNT");
        }

        const bcrypt = await import("bcrypt");
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          const { recordFailedLogin } = await import("@/lib/auth/login-lockout");
          const result = await recordFailedLogin(user.id);
          if (result.locked) {
            throw new Error("LOCKED_ACCOUNT");
          }
          return null;
        }

        // New login → bump sessionVersion (kicks every other device/IP) + clear lockout counter.
        const { clearFailedLogins } = await import("@/lib/auth/login-lockout");
        await clearFailedLogins(user.id);

        const updated = await bumpUserSessionVersion(user.id, {
          touchLogin: true,
          lastLoginIp: loginIp,
        });

        return {
          id: updated.id,
          name: user.name,
          email: user.email,
          role: updated.role,
          status: updated.status,
          sessionVersion: updated.sessionVersion,
          loginIp: loginIp ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.sessionVersion =
          typeof user.sessionVersion === "number" ? user.sessionVersion : 0;
        token.loginIp =
          typeof user.loginIp === "string" ? user.loginIp : undefined;
        token.sessionCheckedAt = Date.now();
        return token;
      }

      if (!token.id && token.sub) {
        token.id = token.sub;
      }

      const userId = typeof token.id === "string" ? token.id : null;
      if (!userId || isMockMode()) {
        return token;
      }

      // Re-check DB on schedule (and on explicit session update) so kick/suspend apply fast.
      const checkedAt =
        typeof token.sessionCheckedAt === "number" ? token.sessionCheckedAt : 0;
      const due =
        trigger === "update" ||
        Date.now() - checkedAt >= authSessionUpdateAgeSec() * 1000;

      if (!due) {
        return token;
      }

      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            status: true,
            role: true,
            sessionVersion: true,
            lastLoginIp: true,
          },
        });

        if (!dbUser || dbUser.status === "SUSPENDED" || dbUser.status === "LOCKED") {
          return {
            ...token,
            error: "SessionInvalid",
            status: dbUser?.status ?? "SUSPENDED",
          };
        }

        const tokenVersion =
          typeof token.sessionVersion === "number" ? token.sessionVersion : -1;
        if (dbUser.sessionVersion !== tokenVersion) {
          // Another device logged in (or password changed / admin kick).
          return { ...token, error: "SessionSuperseded" };
        }

        token.status = dbUser.status;
        token.role = dbUser.role;
        token.sessionVersion = dbUser.sessionVersion;
        token.sessionCheckedAt = Date.now();
      } catch {
        /* keep token if DB briefly unavailable */
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error === "SessionSuperseded" || token.error === "SessionInvalid") {
        // Signal client/middleware that this session is dead.
        session.user = {
          ...session.user,
          id: "",
          role: "USER",
          status: "SUSPENDED",
        };
        (session as { error?: string }).error = String(token.error);
        return session;
      }

      if (session.user) {
        session.user.id =
          (typeof token.id === "string" && token.id) ||
          (typeof token.sub === "string" ? token.sub : "");
        session.user.role = (token.role as Role | undefined) ?? "USER";
        session.user.status =
          (token.status as UserStatus | undefined) ?? "ACTIVE";
        session.user.sessionVersion =
          typeof token.sessionVersion === "number" ? token.sessionVersion : 0;
        session.user.loginIp =
          typeof token.loginIp === "string" ? token.loginIp : null;
      }
      return session;
    },
  },
};
