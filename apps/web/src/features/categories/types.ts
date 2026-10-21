import type { z } from "zod";
import type { categorySchema } from "./schemas";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoryInput = z.infer<typeof categorySchema>;

export type CategoryOption = Pick<Category, "id" | "name" | "slug">;

export type CategoryActionResult = { success: boolean; error?: string; id?: string };
