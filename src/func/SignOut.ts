import { signOut } from "next-auth/react";

export default async function SignOut() {
  await signOut();
}
