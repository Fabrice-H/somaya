import { z } from "zod";
import { phoneSchema } from "@/features/auth/schemas";
import { PASSWORD_MIN_LENGTH } from "./constants";

const name = (label: string) => z.string().trim().min(1, `${label} est requis`).max(100, `${label} est trop long`);

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Au moins ${PASSWORD_MIN_LENGTH} caractères`)
  .max(200, "Mot de passe trop long");

export const optionalEmailSchema = z
  .string()
  .trim()
  .max(255)
  .optional()
  .default("")
  .refine((value) => value === "" || z.email().safeParse(value).success, "Email invalide");

export const registerSchema = z.object({
  firstName: name("Le prénom"),
  lastName: name("Le nom"),
  phone: phoneSchema,
  email: optionalEmailSchema,
  password: passwordSchema,
  orderNumber: z.string().trim().max(50).optional().default(""),
  next: z.string().trim().max(200).optional().default(""),
});

export const loginFormSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "Mot de passe requis").max(200),
  next: z.string().trim().max(200).optional().default(""),
});

export const profileSchema = z.object({
  firstName: name("Le prénom"),
  lastName: name("Le nom"),
  email: optionalEmailSchema,
  address: z.string().trim().max(300).optional().default(""),
  commune: z.string().trim().max(100).optional().default(""),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis").max(200),
    newPassword: passwordSchema,
    confirmPassword: z.string().max(200),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les deux mots de passe ne correspondent pas",
  });

export const setPasswordSchema = z
  .object({ newPassword: passwordSchema, confirmPassword: z.string().max(200) })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les deux mots de passe ne correspondent pas",
  });

export const guestSchema = z.object({ phone: phoneSchema });

export const claimOrderSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^SM-\d{8}-[A-Z0-9]{4}$/, "Numéro de commande invalide (ex. SM-20260922-AB12)"),
  total: z.coerce.number().int().min(0).max(100_000_000),
});

export const orderIdSchema = z.uuid();
