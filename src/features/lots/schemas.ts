import { z } from "zod";

export const priceLotItemSchema = z.object({
  id: z.string().min(1),
  image: z.string().min(1, "Image requise"),
  stock: z.number().int().min(0, "Stock invalide"),
  label: z.string().optional(),
});

export const priceLotSchema = z.object({
  name: z.string().trim().min(1, "Nom requis").max(100, "Nom trop long"),
  price: z.number().min(0, "Prix invalide"),
  category_id: z.string().nullish(),
  items: z.array(priceLotItemSchema).min(1, "Au moins un article requis"),
  is_active: z.boolean(),
  sort_order: z.number().int().optional(),
});

export const priceLotUpdateSchema = priceLotSchema.partial();

export const priceLotIdSchema = z.uuid();
