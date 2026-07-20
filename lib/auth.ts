import { Role, UserStatus } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { isMockMode } from "@/lib/config";
import { mockStore } from "@/lib/mock/store";

async function resolveUserStatus(userId: string): Promise<{
  status: UserStatus;
  role: Role;
} | null> {
  if (isMockMode()) {
    const mockUser = mockStore.users.find((u) => u.id === userId);
    if (!mockUser) return null;
    return { status: mockUser.status, role: mockUser.role };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true, role: true },
  });
  if (!user) return null;
  return { status: user.status, role: user.role };
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/signout",
  },
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
      } else if (!token.id && token.sub) {
        token.id = token.sub;
      } else if (token.id) {
        const fresh = await resolveUserStatus(token.id);
        if (fresh) {
          token.status = fresh.status;
          token.role = fresh.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          (typeof token.id === "string" && token.id) ||
          (typeof token.sub === "string" ? token.sub : "");
        session.user.role = token.role;
        session.user.status = token.status;
      }
      return session;
    },
  },
};
