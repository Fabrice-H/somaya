import { z } from "zod";
import { phoneSchema } from "@/features/auth/schemas";

export const trackOrderSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^SM-\d{8}-[A-Z0-9]{4}$/, "Numéro de commande invalide (ex. SM-20260922-AB12)"),
  phone: phoneSchema,
});
