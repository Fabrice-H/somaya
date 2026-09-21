import { z } from "zod";

// Sanitization helpers
function sanitizeString(val: string): string {
  return val
    .trim()
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>]/g, ""); // Remove remaining angle brackets
}

function sanitizeSlug(val: string): string {
  return val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-") // Replace invalid chars with hyphens
    .replace(/-+/g, "-") // Remove consecutive hyphens
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// Cloudinary URL pattern for validation
const cloudinaryUrlPattern =
  /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9_-]+\/image\/upload\/.+$/;

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(255, "Le nom est trop long (max 255 caractères)")
    .transform(sanitizeString),

  // Slug is now auto-generated server-side, but can be provided optionally
  slug: z
    .string()
    .max(255, "Le slug est trop long")
    .transform((val) => {
      if (!val || val.trim() === "") return undefined;
      return sanitizeSlug(val);
    })
    .optional(),

  description: z
    .string()
    .max(5000, "Description trop longue (max 5000 caractères)")
    .transform(sanitizeString)
    .optional()
    .nullable(),

  price: z
    .number()
    .min(0, "Le prix doit être positif")
    .max(100_000_000, "Prix trop élevé"),

  old_price: z
    .number()
    .min(0, "L'ancien prix doit être positif")
    .max(100_000_000, "Ancien prix trop élevé")
    .optional()
    .nullable(),

  category_id: z.string().uuid("ID de catégorie invalide").optional().nullable(),

  images: z
    .array(
      z.string().refine(
        (url) => {
          // Allow Cloudinary URLs
          if (cloudinaryUrlPattern.test(url)) return true;
          // Allow valid HTTP/HTTPS URLs
          try {
            const parsed = new URL(url);
            return parsed.protocol === "https:" || parsed.protocol === "http:";
          } catch {
            return false;
          }
        },
        { message: "URL d'image invalide" }
      )
    )
    .max(5, "Maximum 5 images")
    .default([]),

  colors: z
    .array(z.string().max(50).transform(sanitizeString))
    .max(20, "Maximum 20 couleurs")
    .default([]),

  sizes: z
    .array(z.string().max(20).transform(sanitizeString))
    .max(10, "Maximum 10 tailles")
    .default([]),

  material: z
    .string()
    .max(255, "Matière trop longue (max 255 caractères)")
    .transform(sanitizeString)
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

  sku: z
    .string()
    .max(100, "SKU trop long (max 100 caractères)")
    .transform(sanitizeString)
    .optional()
    .nullable(),

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

export type ProductSchemaInput = z.input<typeof productSchema>;
export type ProductSchemaOutput = z.output<typeof productSchema>;

// Partial schema for updates
export const productUpdateSchema = productSchema.partial();

export type ProductUpdateInput = z.input<typeof productUpdateSchema>;
