import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  roleId: String;
  permissions: string[];
  isTwoFactorEnabled: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
