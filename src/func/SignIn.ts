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

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      existingUser.name,
      verificationToken.email,
      verificationToken.token
    );

    return { success: "¡Correo electrónico de confirmación enviado!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) return { error: "¡Código inválido!" };

      if (twoFactorToken.token !== code) return { error: "¡Código inválido!" };

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) return { error: "¡Código expirado!" };

      await prisma.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(
        existingUser.name,
        twoFactorToken.email,
        twoFactorToken.token
      );
      return { twoFactor: true };
    }
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
