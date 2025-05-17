"use server";
import z from "zod";
import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/User";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import prisma from "@/lib/prisma";
import { getTwoFactorTokenByEmail } from "@/data/TwoFactorToken";
import { getTwoFactorConfirmationByUserId } from "@/data/TwoFactorConfirmation";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/func/Mail";
import { SignInSchema } from "@/components/auth/auth-schema";

export default async function SignIn(values: z.infer<typeof SignInSchema>) {
  const validatedFields = SignInSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Campos inválidos!" };

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Usuario no existe!" };
  }

  if (existingUser.status !== "A") {
    return { error: "Usuario inactivo!" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Contraseña invalida!" };
        default:
          return { error: "¡Algo salió mal!" };
      }
    }
    throw error;
  }
}
