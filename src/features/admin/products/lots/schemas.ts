import { z } from "zod";

function sanitizeString(val: string): string {
  return val
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "");
}

const cloudinaryUrlPattern =
  /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9_-]+\/image\/upload\/.+$/;

// Schema for individual items within a lot
export const lotItemSchema = z.object({
  id: z.string(),
  image: z.string().refine(
    (url) => {
      if (cloudinaryUrlPattern.test(url)) return true;
      try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
      } catch {
        return false;
      }
    },
    { message: "URL d'image invalide" }
  ),
  stock: z
    .number()
    .int("Le stock doit être un entier")
    .min(0, "Le stock ne peut pas être négatif")
    .max(1_000_000, "Stock trop élevé")
    .default(0),
  label: z.string().max(100).optional(),
});

export const productLotSchema = z.object({
  id: z.string().optional(),

  name: z
    .string()
    .min(1, "Le nom du lot est requis")
    .max(100, "Le nom est trop long (max 100 caractères)")
    .transform(sanitizeString),

  price: z
    .number()
    .min(0, "Le prix doit être positif")
    .max(100_000_000, "Prix trop élevé"),

  // New: items array - each item is a purchasable article
  items: z
    .array(lotItemSchema)
    .max(50, "Maximum 50 articles par lot")
    .default([]),

  is_available: z.boolean().default(true),

  sort_order: z
    .number()
    .int("L'ordre doit être un entier")
    .min(0, "L'ordre ne peut pas être négatif")
    .max(10_000, "Ordre trop élevé")
    .default(0),
});

export type LotItemSchemaInput = z.input<typeof lotItemSchema>;
export type LotItemSchemaOutput = z.output<typeof lotItemSchema>;
export type ProductLotSchemaInput = z.input<typeof productLotSchema>;
export type ProductLotSchemaOutput = z.output<typeof productLotSchema>;

export const productLotsArraySchema = z.array(productLotSchema);
