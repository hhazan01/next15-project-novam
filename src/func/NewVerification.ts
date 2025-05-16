"use server";
import prisma from "@/lib/prisma";
import { getUserByEmail } from "@/data/User";
import { getVerificationTokenByToken } from "@/data/VerificationToken";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) return { error: "¡El token no existe!" };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "¡El token ha expirado!" };

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: "¡El correo electrónico no existe!" };

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "¡Correo electrónico verificado!" };
};
