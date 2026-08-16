"use server";

import { revalidatePath } from "next/cache";
import { db, instagramPosts, storeSettings } from "@/lib/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/actions";
import type { InstagramPost } from "@/lib/db/schema";

export type InstagramPostData = {
  id: string;
  image: string;
  postUrl: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type InstagramSettings = {
  username: string;
  profileUrl: string;
};

function toInstagramPostData(data: InstagramPost): InstagramPostData {
  return {
    id: data.id,
    image: data.image,
    postUrl: data.postUrl,
    isActive: data.isActive,
    sortOrder: data.sortOrder,
  };
}

/**
 * Get all Instagram posts for admin
 */
export async function getInstagramPosts(): Promise<InstagramPostData[]> {
  const result = await db.query.instagramPosts.findMany({
    orderBy: [asc(instagramPosts.sortOrder)],
  });
  return result.map(toInstagramPostData);
}

/**
 * Get active Instagram posts for public display
 */
export async function getActiveInstagramPosts(): Promise<InstagramPostData[]> {
  const result = await db.query.instagramPosts.findMany({
    where: eq(instagramPosts.isActive, true),
    orderBy: [asc(instagramPosts.sortOrder)],
    limit: 6,
  });
  return result.map(toInstagramPostData);
}

/**
 * Get Instagram settings from store settings
 */
export async function getInstagramSettings(): Promise<InstagramSettings> {
  const settings = await db.query.storeSettings.findFirst();
  return {
    username: settings?.instagramHandle || "so_maya_ci",
    profileUrl: `https://www.instagram.com/${settings?.instagramHandle || "so_maya_ci"}/`,
  };
}

/**
 * Create Instagram post
 */
export async function createInstagramPost(
  data: Omit<InstagramPostData, "id">
): Promise<{ success: boolean; error?: string; id?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    const [result] = await db
      .insert(instagramPosts)
      .values({
        image: data.image,
        postUrl: data.postUrl,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      })
      .returning({ id: instagramPosts.id });

    revalidatePath("/");
    revalidatePath("/admin/instagram");

    return { success: true, id: result.id };
  } catch (error) {
    console.error("Error creating Instagram post:", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}

/**
 * Update Instagram post
 */
export async function updateInstagramPost(
  id: string,
  data: Partial<Omit<InstagramPostData, "id">>
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    await db
      .update(instagramPosts)
      .set(data)
      .where(eq(instagramPosts.id, id));

    revalidatePath("/");
    revalidatePath("/admin/instagram");

    return { success: true };
  } catch (error) {
    console.error("Error updating Instagram post:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

/**
 * Delete Instagram post
 */
export async function deleteInstagramPost(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    await db.delete(instagramPosts).where(eq(instagramPosts.id, id));

    revalidatePath("/");
    revalidatePath("/admin/instagram");

    return { success: true };
  } catch (error) {
    console.error("Error deleting Instagram post:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

/**
 * Reorder Instagram posts
 */
export async function reorderInstagramPosts(
  items: { id: string; sortOrder: number }[]
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    for (const item of items) {
      await db
        .update(instagramPosts)
        .set({ sortOrder: item.sortOrder })
        .where(eq(instagramPosts.id, item.id));
    }

    revalidatePath("/");
    revalidatePath("/admin/instagram");

    return { success: true };
  } catch (error) {
    console.error("Error reordering Instagram posts:", error);
    return { success: false, error: "Erreur lors du réordonnancement" };
  }
}
