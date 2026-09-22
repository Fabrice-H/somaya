import { z } from "zod";
import { normalizePhone } from "@/shared/lib/phone";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(255).email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis").max(200),
});

export const phoneSchema = z
  .string()
  .trim()
  .max(30)
  .refine((value) => normalizePhone(value) !== null, "Numéro de téléphone invalide (10 chiffres attendus)");

export const customerLoginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "Mot de passe requis").max(200),
});
