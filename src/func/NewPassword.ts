"use server";
import z from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/User";
import prisma from "@/lib/prisma";
import { getPasswordResetTokenByToken } from "@/data/PasswordResetToken";
import { NewPassowrdSchema } from "@/components/auth/auth-schema";

export const newPassword = async (
  values: z.infer<typeof NewPassowrdSchema>,
  token?: string | null
) => {
  if (!token) return { error: "¡Falta el token!" };

  const validatedFields = NewPassowrdSchema.safeParse(values);

  if (!validatedFields.success) return { error: "¡Campos inválidos!" };

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) return { error: "¡Token inválido!" };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "¡El token ha expirado!" };

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: "¡El correo electrónico no existe!" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "¡Contraseña actualizada!" };
};
