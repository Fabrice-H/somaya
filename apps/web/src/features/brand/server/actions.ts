"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { aboutCollections, db } from "@/shared/lib/db";
import { requireAdmin } from "@/features/auth/server/session";
import { ABOUT_PAGE_PATH } from "../constants";
import { collectionIdSchema, collectionOrderSchema, collectionPatchSchema, collectionSchema } from "../schemas";
import type { CollectionActionResult, CollectionInput, CollectionPatch } from "../types";

const UNAUTHORIZED = { success: false, error: "Non autorisé" } as const;

export async function createAboutCollection(input: CollectionInput): Promise<CollectionActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  const parsed = collectionSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    const [row] = await db.insert(aboutCollections).values(parsed.data).returning({ id: aboutCollections.id });
    revalidatePath(ABOUT_PAGE_PATH);
    return { success: true, id: row.id };
  } catch {
    return { success: false, error: "Erreur lors de la création" };
  }
}

export async function updateAboutCollection(id: string, patch: CollectionPatch): Promise<CollectionActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  const parsedId = collectionIdSchema.safeParse(id);
  const parsed = collectionPatchSchema.safeParse(patch);
  if (!parsedId.success) return { success: false, error: "Collection introuvable" };
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    await db
      .update(aboutCollections)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(aboutCollections.id, parsedId.data));
    revalidatePath(ABOUT_PAGE_PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

export async function deleteAboutCollection(id: string): Promise<CollectionActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  const parsedId = collectionIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: "Collection introuvable" };

  try {
    await db.delete(aboutCollections).where(eq(aboutCollections.id, parsedId.data));
    revalidatePath(ABOUT_PAGE_PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

export async function reorderAboutCollections(orderedIds: string[]): Promise<CollectionActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  const parsed = collectionOrderSchema.safeParse(orderedIds);
  if (!parsed.success) return { success: false, error: "Ordre invalide" };

  try {
    const updatedAt = new Date();
    await Promise.all(
      parsed.data.map((id, sortOrder) =>
        db.update(aboutCollections).set({ sortOrder, updatedAt }).where(eq(aboutCollections.id, id))
      )
    );
    revalidatePath(ABOUT_PAGE_PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Erreur lors du réordonnancement" };
  }
}
