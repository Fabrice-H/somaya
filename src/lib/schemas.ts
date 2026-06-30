import { z } from "zod";

export const productColorSchema = z.enum([
  "orange",
  "rouge",
  "violet",
  "bleu",
  "noir",
  "blanc",
  "creme",
  "camel",
  "vert",
  "or",
  "gris",
]);

export type ProductColor = z.infer<typeof productColorSchema>;

export const productCategorySchema = z.enum([
  "Femmes",
  "Hommes",
  "Bijoux",
  "Sacs",
  "Montres",
  "Boubous",
]);

export type ProductCategory = z.infer<typeof productCategorySchema>;

export const productCollectionSchema = z.enum([
  "Cérémonie",
  "Soirée",
  "Quotidien",
  "Intemporel",
]);

export type ProductCollection = z.infer<typeof productCollectionSchema>;

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: productCategorySchema,
  collection: productCollectionSchema,
  price: z.number(),
  originalPrice: z.number().optional(),
  badge: z.string().optional(),
  isBestseller: z.boolean().optional(),
  colors: z.array(productColorSchema),
  sizes: z.array(z.string()),
  images: z.array(z.string()),
  description: z.string(),
});

export type Product = z.infer<typeof productSchema>;

export const checkoutFormSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  phone: z.string().min(8, "Le numéro de téléphone est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().min(1, "La ville est requise"),
  country: z.string().default("Côte d'Ivoire"),
  shippingMethod: z.enum(["abidjan", "horsAbidjan"]),
  paymentMethod: z.enum(["livraison", "mobileMoney", "virement"]),
  notes: z.string().optional(),
});

export type CheckoutForm = z.infer<typeof checkoutFormSchema>;

export const COLOR_HEX: Record<ProductColor, { name: string; hex: string }> = {
  orange: { name: "Orange", hex: "#cf5a2a" },
  rouge: { name: "Rouge", hex: "#b0202a" },
  violet: { name: "Violet", hex: "#5b3b8c" },
  bleu: { name: "Bleu", hex: "#6f9bd1" },
  noir: { name: "Noir", hex: "#2a2422" },
  blanc: { name: "Blanc", hex: "#e7e0d6" },
  creme: { name: "Crème", hex: "#e0d0b4" },
  camel: { name: "Camel", hex: "#b07d4f" },
  vert: { name: "Vert", hex: "#2f7d52" },
  or: { name: "Or", hex: "#c9a24a" },
  gris: { name: "Gris", hex: "#8f8a85" },
};
