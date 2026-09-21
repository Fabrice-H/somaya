import { z } from "zod";
import { PRODUCT_MAX_IMAGES } from "./constants";
import { isHttpUrl, sanitizeSlug, sanitizeText } from "./utils";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(255, "Le nom est trop long (max 255 caractères)")
    .transform(sanitizeText),
  slug: z
    .string()
    .max(255, "Le slug est trop long")
    .transform((val) => (val.trim() ? sanitizeSlug(val) : undefined))
    .optional(),
  description: z.string().max(5000, "Description trop longue (max 5000 caractères)").optional().nullable(),
  price: z.number().min(0, "Le prix doit être positif").max(100_000_000, "Prix trop élevé"),
  old_price: z
    .number()
    .min(0, "L'ancien prix doit être positif")
    .max(100_000_000, "Ancien prix trop élevé")
    .optional()
    .nullable(),
  category_id: z.string().uuid("ID de catégorie invalide").optional().nullable(),
  images: z
    .array(z.string().refine(isHttpUrl, { message: "URL d'image invalide" }))
    .max(PRODUCT_MAX_IMAGES, `Maximum ${PRODUCT_MAX_IMAGES} images`)
    .default([]),
  colors: z.array(z.string().max(50).transform(sanitizeText)).max(20, "Maximum 20 couleurs").default([]),
  sizes: z.array(z.string().max(20).transform(sanitizeText)).max(10, "Maximum 10 tailles").default([]),
  material: z
    .string()
    .max(255, "Matière trop longue (max 255 caractères)")
    .transform(sanitizeText)
    .optional()
    .nullable(),
  stock: z
    .number()
    .int("Le stock doit être un entier")
    .min(0, "Le stock ne peut pas être négatif")
    .max(1_000_000, "Stock trop élevé")
    .default(0),
  low_stock_threshold: z
    .number()
    .int("Le seuil doit être un entier")
    .min(0, "Le seuil ne peut pas être négatif")
    .max(10_000, "Seuil trop élevé")
    .default(5),
  sku: z.string().max(100, "SKU trop long (max 100 caractères)").transform(sanitizeText).optional().nullable(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
  is_bestseller: z.boolean().default(false),
  sort_order: z
    .number()
    .int("L'ordre doit être un entier")
    .min(0, "L'ordre ne peut pas être négatif")
    .max(10_000, "Ordre trop élevé")
    .default(0),
});

export const productUpdateSchema = productSchema.partial();

export const productIdSchema = z.string().uuid("ID de produit invalide");
