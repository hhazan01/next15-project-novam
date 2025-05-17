"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { UserSchema } from "@/components/settings/setting-schema";
import { getUserByEmail } from "@/data/User";
import prisma from "@/lib/prisma";
import { oneTime } from "@/components/template/oneTime";
import { sendNotifications } from "./Mail";

function generateRandomPassword(length = 20): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createUser(values: z.infer<typeof UserSchema>) {
  try {
    const validatedFields = UserSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Campos inválidos!" };
    }

    const { name, email, role, status, isTwoFactorEnabled } =
      validatedFields.data;

    const existingEmail = await getUserByEmail(email);

    if (existingEmail) {
      return { error: "El correo electrónico ya está en uso." };
    }

    const password = generateRandomPassword();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: role,
        status,
        image: "/Logo.jpg",
        isTwoFactorEnabled,
      },
    });

    const body = oneTime
      .replace("%TITLE%", "Bienvenido a NOVAM")
      .replace("%FROM%", user.name)
      .replace(
        "%MESSAGE%",
        `Tu contraseña es: ${password} y tu usuario es: ${user.email}.`
      );

    await sendNotifications({
      to: user.email,
      subject: "Bienvenido a NOVAM",
      html: body,
    });

    return { success: "Usuario creado!" };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido en el servidor";
    return { error: message };
  }
}
