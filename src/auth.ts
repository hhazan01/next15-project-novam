import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/User";
import { getPermissionsByRoleId } from "@/data/Permission";
import { getTwoFactorConfirmationByUserId } from "./data/TwoFactorConfirmation";
import prisma from "@/lib/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id as string);

      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        await prisma.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (token.roleId) {
        session.user.roleId = token.roleId as string;
        session.user.permissions = token.permissions as string[];
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      if (existingUser.roleId) {
        const permissions = await getPermissionsByRoleId(existingUser.roleId);

        token.roleId = existingUser.roleId;
        token.permissions = permissions;
      }

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.status = existingUser.status;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 1800, // 30 minutos en segundos
    updateAge: 900, // 15 minutos en segundos
  },
  ...authConfig,
});
