import { z } from "zod";
import { normalizePhone } from "@/shared/lib/phone";
import { ABIDJAN_COMMUNES, DELIVERY_METHODS, MAX_CART_LINES, MAX_LINE_QUANTITY } from "./constants";

const requiredText = (label: string, max: number) =>
  z.string().trim().min(1, `${label} est requis`).max(max, `${label} est trop long`);

export const checkoutCustomerSchema = z.object({
  firstName: requiredText("Le prénom", 100),
  lastName: requiredText("Le nom", 100),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9 +]{8,20}$/, "Numéro de téléphone invalide")
    .refine((value) => normalizePhone(value) !== null, "Numéro de téléphone invalide (10 chiffres attendus)"),
  email: z
    .string()
    .trim()
    .max(255)
    .optional()
    .default("")
    .refine((value) => value === "" || z.email().safeParse(value).success, "Email invalide"),
  commune: z.string().trim().max(100).optional().default(""),
  address: z.string().trim().max(300).optional().default(""),
  notes: z.string().trim().max(500).optional().default(""),
});

export const checkoutLineSchema = z.object({
  productId: z.string().min(1).max(100),
  lotId: z.string().max(100).nullable(),
  itemId: z.string().max(200).nullable(),
  quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY),
});

export const checkoutSchema = z
  .object({
    customer: checkoutCustomerSchema,
    deliveryMethod: z.enum(DELIVERY_METHODS),
    lines: z.array(checkoutLineSchema).min(1, "Votre panier est vide").max(MAX_CART_LINES),
  })
  .superRefine(({ customer, deliveryMethod }, ctx) => {
    if (deliveryMethod === "delivery" && !(ABIDJAN_COMMUNES as readonly string[]).includes(customer.commune)) {
      ctx.addIssue({ code: "custom", path: ["customer", "commune"], message: "Choisissez votre commune" });
    }
  });

export type CheckoutCustomer = z.output<typeof checkoutCustomerSchema>;
export type CheckoutFormValues = Record<keyof CheckoutCustomer, string>;
export type CheckoutLine = z.output<typeof checkoutLineSchema>;
export type DeliveryMethod = (typeof DELIVERY_METHODS)[number];
