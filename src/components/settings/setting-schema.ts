import { z } from "zod";

export const UserSchema = z.object({
  id: z.optional(z.string()),
  status: z.string().min(1, "Debe seleccionar un estatus."),
  role: z.string().min(1, "Debe seleccionar un rol."),
  name: z.string().min(1, "Debe ingresar un nombre."),
  email: z.string().email("Email is required"),
  isTwoFactorEnabled: z.boolean(),
});
