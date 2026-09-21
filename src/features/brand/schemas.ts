import { z } from "zod";
import { sanitizePlainText } from "@/shared/lib/sanitize";
import { DEFAULT_COLLECTION_COLOR } from "./constants";

export const collectionSchema = z.object({
  name: z.string().max(100, "Nom trop long").transform(sanitizePlainText).refine(Boolean, "Le nom est requis"),
  year: z.string().trim().min(4, "L'année est requise").max(10, "Année invalide"),
  backgroundColor: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, "Couleur invalide")
    .default(DEFAULT_COLLECTION_COLOR),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export const collectionPatchSchema = collectionSchema
  .pick({ name: true, year: true, backgroundColor: true, isActive: true })
  .partial();

export const collectionIdSchema = z.uuid();

export const collectionOrderSchema = z.array(z.uuid()).max(100);
