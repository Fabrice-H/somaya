"use server";

import { revalidatePath } from "next/cache";
import { db, aboutCollections } from "@/lib/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/actions";
import { z } from "zod";

export interface AboutCollectionData {
  id: string;
  name: string;
  year: string;
  backgroundColor: string;
  isActive: boolean;
  sortOrder: number;
}

const collectionSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  year: z.string().min(4, "L'année est requise"),
  backgroundColor: z.string().default("#511F29"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export type CollectionInput = z.infer<typeof collectionSchema>;

/**
 * Get all about collections
 */
export async function getAboutCollections(): Promise<AboutCollectionData[]> {
  const results = await db.query.aboutCollections.findMany({
    orderBy: [asc(aboutCollections.sortOrder)],
  });

  return results.map((r) => ({
    id: r.id,
    name: r.name,
    year: r.year,
    backgroundColor: r.backgroundColor || "#511F29",
    isActive: r.isActive,
    sortOrder: r.sortOrder,
  }));
}

/**
 * Get active about collections for public display
 */
export async function getAboutCollectionsPublic(): Promise<AboutCollectionData[]> {
  const results = await db.query.aboutCollections.findMany({
    where: eq(aboutCollections.isActive, true),
    orderBy: [asc(aboutCollections.sortOrder)],
  });

  return results.map((r) => ({
    id: r.id,
    name: r.name,
    year: r.year,
    backgroundColor: r.backgroundColor || "#511F29",
    isActive: r.isActive,
    sortOrder: r.sortOrder,
  }));
}

/**
 * Create a new about collection
 */
export async function createAboutCollection(
  input: CollectionInput
): Promise<{ success: boolean; error?: string; id?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  const parsed = collectionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [result] = await db
      .insert(aboutCollections)
      .values({
        name: parsed.data.name,
        year: parsed.data.year,
        backgroundColor: parsed.data.backgroundColor,
        isActive: parsed.data.isActive,
        sortOrder: parsed.data.sortOrder,
      })
      .returning({ id: aboutCollections.id });

    revalidatePath("/a-propos");
    revalidatePath("/admin/about-collections");

    return { success: true, id: result.id };
  } catch (error) {
    console.error("Error creating about collection:", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}

/**
 * Update an about collection
 */
export async function updateAboutCollection(
  id: string,
  input: Partial<CollectionInput>
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    await db
      .update(aboutCollections)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(aboutCollections.id, id));

    revalidatePath("/a-propos");
    revalidatePath("/admin/about-collections");

    return { success: true };
  } catch (error) {
    console.error("Error updating about collection:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

/**
 * Delete an about collection
 */
export async function deleteAboutCollection(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    await db.delete(aboutCollections).where(eq(aboutCollections.id, id));

    revalidatePath("/a-propos");
    revalidatePath("/admin/about-collections");

    return { success: true };
  } catch (error) {
    console.error("Error deleting about collection:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

/**
 * Reorder about collections
 */
export async function reorderAboutCollections(
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    for (let i = 0; i < orderedIds.length; i++) {
      await db
        .update(aboutCollections)
        .set({ sortOrder: i, updatedAt: new Date() })
        .where(eq(aboutCollections.id, orderedIds[i]));
    }

    revalidatePath("/a-propos");
    revalidatePath("/admin/about-collections");

    return { success: true };
  } catch (error) {
    console.error("Error reordering about collections:", error);
    return { success: false, error: "Erreur lors du réordonnancement" };
  }
}
