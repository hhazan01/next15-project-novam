import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email({
    message: "El correo electrónico es requerido",
  }),
  password: z.string().min(1, {
    message: "La contraseña es requerida",
  }),
  code: z.optional(z.string()),
});

export const ResetSchema = z.object({
  email: z
    .string()
    .email({
      message: "El correo electrónico es requerido",
    })
    .refine((val) => val.endsWith("@movilnet.com.ve"), {
      message: "El correo debe ser institucional (@movilnet.com.ve)",
    }),
});

export const NewPassowrdSchema = z.object({
  password: z.string().min(6, {
    message: "Se require una contraseña de al menos 6 caracteres",
  }),
});
