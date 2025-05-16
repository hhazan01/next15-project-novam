"use server";
import { z } from "zod";
import { getUserByEmail } from "@/data/User";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/func/Mail";
import { ResetSchema } from "@/components/auth/auth-schema";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Campos inválidos!" };

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) return { error: "El correo electrónico no existe!" };

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    existingUser.name,
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "¡Correo electrónico de reinicio enviado!" };
};
