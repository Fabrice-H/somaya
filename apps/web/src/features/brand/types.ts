import type { z } from "zod";
import type { collectionSchema } from "./schemas";

export type AboutCollectionData = {
  id: string;
  name: string;
  year: string;
  backgroundColor: string;
  isActive: boolean;
  sortOrder: number;
};

export type CollectionInput = z.input<typeof collectionSchema>;

export type CollectionDraft = Pick<AboutCollectionData, "name" | "year" | "backgroundColor">;

export type CollectionPatch = Partial<Pick<AboutCollectionData, "name" | "year" | "backgroundColor" | "isActive">>;

export type CollectionActionResult = { success: boolean; error?: string; id?: string };
