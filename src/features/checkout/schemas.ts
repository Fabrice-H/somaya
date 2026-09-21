import { z } from "zod";
import { ABIDJAN_COMMUNES, MAX_CART_LINES, MAX_LINE_QUANTITY } from "./constants";

const requiredText = (label: string, max: number) =>
  z.string().trim().min(1, `${label} est requis`).max(max, `${label} est trop long`);

export const checkoutCustomerSchema = z.object({
  firstName: requiredText("Le prénom", 100),
  lastName: requiredText("Le nom", 100),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9 +]{8,20}$/, "Numéro de téléphone invalide"),
  commune: z.enum(ABIDJAN_COMMUNES, { message: "Choisissez votre commune" }),
  address: z.string().trim().max(300).optional().default(""),
  notes: z.string().trim().max(500).optional().default(""),
});

export const checkoutLineSchema = z.object({
  productId: z.string().min(1).max(100),
  lotId: z.string().max(100).nullable(),
  itemId: z.string().max(200).nullable(),
  quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY),
});

export const checkoutSchema = z.object({
  customer: checkoutCustomerSchema,
  lines: z.array(checkoutLineSchema).min(1, "Votre panier est vide").max(MAX_CART_LINES),
});

export type CheckoutCustomer = z.output<typeof checkoutCustomerSchema>;
export type CheckoutFormValues = Record<keyof CheckoutCustomer, string>;
export type CheckoutLine = z.output<typeof checkoutLineSchema>;
