import { z } from "zod";
import { MAX_RATING } from "./constants";

export const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis").max(255, "Nom trop long"),
  location: z.string().trim().max(255, "Lieu trop long").nullable(),
  image: z.string().max(500).nullable(),
  text: z.string().trim().min(1, "Le témoignage est requis"),
  rating: z.number().int().min(1).max(MAX_RATING),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0),
});

export const testimonialUpdateSchema = testimonialSchema.partial();
