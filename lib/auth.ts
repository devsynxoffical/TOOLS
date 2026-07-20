import { Role, UserStatus } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { isMockMode } from "@/lib/config";
import { mockStore } from "@/lib/mock/store";

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
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const normalizedEmail = email.toLowerCase();

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
          return {
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            role: mockUser.role,
            status: mockUser.status,
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

        const bcrypt = await import("bcrypt");
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        return token;
      }
      if (!token.id && token.sub) {
        token.id = token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          (typeof token.id === "string" && token.id) ||
          (typeof token.sub === "string" ? token.sub : "");
        session.user.role = (token.role as Role | undefined) ?? "USER";
        session.user.status = (token.status as UserStatus | undefined) ?? "ACTIVE";
      }
      return session;
    },
  },
};
