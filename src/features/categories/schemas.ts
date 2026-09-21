import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis"),
  slug: z.string().trim().min(1, "Le slug est requis"),
  description: z.string().nullish(),
  image_url: z.string().nullish(),
  position: z.number().int().min(0),
  is_active: z.boolean(),
});

export const categoryUpdateSchema = categorySchema.partial();

export const categoryIdSchema = z.uuid();
