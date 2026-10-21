"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { categories, db } from "@/shared/lib/db";
import { requireAdmin } from "@/features/auth/server/session";
import { CATEGORIES_CACHE_TAG, CATEGORY_REVALIDATE_PATHS } from "../constants";
import { categorySchema, categoryUpdateSchema } from "../schemas";
import type { CategoryActionResult, CategoryInput } from "../types";

const UNAUTHORIZED: CategoryActionResult = { success: false, error: "Non autorisé" };

function revalidateCategories() {
  CATEGORY_REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
  updateTag(CATEGORIES_CACHE_TAG);
}

function isUniqueViolation(error: unknown) {
  return error instanceof Error && /unique constraint|duplicate key/i.test(`${error.message} ${error.cause ?? ""}`);
}

export async function createCategory(input: CategoryInput): Promise<CategoryActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { name, slug, description, image_url, position, is_active } = parsed.data;

  try {
    const [row] = await db
      .insert(categories)
      .values({
        name,
        slug,
        description: description || null,
        imageUrl: image_url || null,
        position,
        isActive: is_active,
      })
      .returning({ id: categories.id });

    revalidateCategories();
    return { success: true, id: row.id };
  } catch (error) {
    console.error("createCategory failed:", error);
    if (isUniqueViolation(error)) return { success: false, error: "Ce slug existe déjà" };
    return { success: false, error: "Erreur lors de la création" };
  }
}

export async function updateCategory(id: string, input: Partial<CategoryInput>): Promise<CategoryActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  const parsed = categoryUpdateSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { name, slug, description, image_url, position, is_active } = parsed.data;

  try {
    await db
      .update(categories)
      .set({
        name,
        slug,
        description,
        imageUrl: image_url,
        position,
        isActive: is_active,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id));

    revalidateCategories();
    return { success: true };
  } catch (error) {
    console.error("updateCategory failed:", error);
    if (isUniqueViolation(error)) return { success: false, error: "Ce slug existe déjà" };
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

export async function deleteCategory(id: string): Promise<CategoryActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidateCategories();
    return { success: true };
  } catch (error) {
    console.error("deleteCategory failed:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}
