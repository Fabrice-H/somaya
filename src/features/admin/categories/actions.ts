"use server";

import { db, categories } from "@/lib/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/actions";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Category as DbCategory } from "@/lib/db/schema";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const categorySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  description: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  position: z.number().default(0),
  is_active: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// Helper to convert DB category to admin format
function toAdminCategory(category: DbCategory): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image_url: category.imageUrl,
    position: category.position,
    is_active: category.isActive,
    created_at: category.createdAt.toISOString(),
    updated_at: category.updatedAt.toISOString(),
  };
}

export async function getCategories(): Promise<Category[]> {
  const admin = await requireAdmin();
  if (!admin) return [];

  try {
    const result = await db.query.categories.findMany({
      orderBy: [asc(categories.position)],
    });

    return result.map(toAdminCategory);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoriesPublic(): Promise<Category[]> {
  try {
    const result = await db.query.categories.findMany({
      where: eq(categories.isActive, true),
      orderBy: [asc(categories.position)],
    });

    return result.map(toAdminCategory);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const admin = await requireAdmin();
  if (!admin) return null;

  try {
    const result = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });

    if (!result) return null;
    return toAdminCategory(result);
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function createCategory(
  input: CategoryInput
): Promise<{ success: boolean; error?: string; id?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [result] = await db
      .insert(categories)
      .values({
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
        imageUrl: parsed.data.image_url || null,
        position: parsed.data.position ?? 0,
        isActive: parsed.data.is_active ?? true,
      })
      .returning({ id: categories.id });

    revalidatePath("/admin/categories");
    revalidatePath("/catalogue");
    revalidatePath("/"); // Invalidate home page

    return { success: true, id: result.id };
  } catch (error: unknown) {
    console.error("Error creating category:", error);
    if (
      error instanceof Error &&
      error.message.includes("unique constraint")
    ) {
      return { success: false, error: "Ce slug existe déjà" };
    }
    return { success: false, error: "Erreur lors de la création" };
  }
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    const updateData: Record<string, unknown> = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.description !== undefined)
      updateData.description = input.description;
    if (input.image_url !== undefined) updateData.imageUrl = input.image_url;
    if (input.position !== undefined) updateData.position = input.position;
    if (input.is_active !== undefined) updateData.isActive = input.is_active;

    updateData.updatedAt = new Date();

    await db.update(categories).set(updateData).where(eq(categories.id, id));

    revalidatePath("/admin/categories");
    revalidatePath("/catalogue");
    revalidatePath("/"); // Invalidate home page

    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

export async function deleteCategory(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    await db.delete(categories).where(eq(categories.id, id));

    revalidatePath("/admin/categories");
    revalidatePath("/catalogue");
    revalidatePath("/"); // Invalidate home page

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

export async function reorderCategories(
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    // Update each category's position
    await Promise.all(
      orderedIds.map((id, index) =>
        db
          .update(categories)
          .set({ position: index, updatedAt: new Date() })
          .where(eq(categories.id, id))
      )
    );

    revalidatePath("/admin/categories");
    revalidatePath("/catalogue");
    revalidatePath("/"); // Invalidate home page

    return { success: true };
  } catch (error) {
    console.error("Error reordering categories:", error);
    return { success: false, error: "Erreur lors du réordonnement" };
  }
}
