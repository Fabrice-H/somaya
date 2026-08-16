"use server";

import { db, featuredCollection } from "@/lib/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/actions";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import type { FeaturedCollection as DbFeaturedCollection } from "@/lib/db/schema";

// Fixed ID for singleton record
const FEATURED_COLLECTION_ID = "00000000-0000-0000-0000-000000000002";

export interface FeaturedCollectionData {
  id: string;
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  stat1_value: string | null;
  stat1_label: string | null;
  stat2_value: string | null;
  stat2_label: string | null;
  button_text: string | null;
  button_link: string | null;
  images: string[];
  category_id: string | null;
  is_active: boolean;
}

const featuredCollectionSchema = z.object({
  eyebrow: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  stat1_value: z.string().optional().nullable(),
  stat1_label: z.string().optional().nullable(),
  stat2_value: z.string().optional().nullable(),
  stat2_label: z.string().optional().nullable(),
  button_text: z.string().optional().nullable(),
  button_link: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
  category_id: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type FeaturedCollectionInput = z.infer<typeof featuredCollectionSchema>;

// Helper to convert DB record to admin format
function toAdminFormat(data: DbFeaturedCollection): FeaturedCollectionData {
  return {
    id: data.id,
    eyebrow: data.eyebrow,
    title: data.title,
    description: data.description,
    stat1_value: data.stat1Value,
    stat1_label: data.stat1Label,
    stat2_value: data.stat2Value,
    stat2_label: data.stat2Label,
    button_text: data.buttonText,
    button_link: data.buttonLink,
    images: data.images || [],
    category_id: data.categoryId,
    is_active: data.isActive,
  };
}

export async function getFeaturedCollection(): Promise<FeaturedCollectionData | null> {
  try {
    const result = await db.query.featuredCollection.findFirst({
      where: eq(featuredCollection.id, FEATURED_COLLECTION_ID),
    });

    if (!result) return null;
    return toAdminFormat(result);
  } catch (error) {
    console.error("Error fetching featured collection:", error);
    return null;
  }
}

export async function getFeaturedCollectionPublic(): Promise<FeaturedCollectionData | null> {
  try {
    const result = await db.query.featuredCollection.findFirst({
      where: eq(featuredCollection.id, FEATURED_COLLECTION_ID),
    });

    if (!result || !result.isActive) return null;
    return toAdminFormat(result);
  } catch (error) {
    console.error("Error fetching featured collection:", error);
    return null;
  }
}

export async function updateFeaturedCollection(
  input: FeaturedCollectionInput
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  const parsed = featuredCollectionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    // Check if record exists
    const existing = await db.query.featuredCollection.findFirst({
      where: eq(featuredCollection.id, FEATURED_COLLECTION_ID),
    });

    if (existing) {
      // Update existing
      await db
        .update(featuredCollection)
        .set({
          eyebrow: parsed.data.eyebrow,
          title: parsed.data.title,
          description: parsed.data.description,
          stat1Value: parsed.data.stat1_value,
          stat1Label: parsed.data.stat1_label,
          stat2Value: parsed.data.stat2_value,
          stat2Label: parsed.data.stat2_label,
          buttonText: parsed.data.button_text,
          buttonLink: parsed.data.button_link,
          images: parsed.data.images,
          categoryId: parsed.data.category_id || null,
          isActive: parsed.data.is_active,
          updatedAt: new Date(),
        })
        .where(eq(featuredCollection.id, FEATURED_COLLECTION_ID));
    } else {
      // Create new
      await db.insert(featuredCollection).values({
        id: FEATURED_COLLECTION_ID,
        eyebrow: parsed.data.eyebrow,
        title: parsed.data.title,
        description: parsed.data.description,
        stat1Value: parsed.data.stat1_value,
        stat1Label: parsed.data.stat1_label,
        stat2Value: parsed.data.stat2_value,
        stat2Label: parsed.data.stat2_label,
        buttonText: parsed.data.button_text,
        buttonLink: parsed.data.button_link,
        images: parsed.data.images,
        categoryId: parsed.data.category_id || null,
        isActive: parsed.data.is_active,
      });
    }

    revalidatePath("/admin/reglages");
    revalidatePath("/admin/collection-vedette");
    revalidatePath("/", "layout"); // Force full page revalidation
    revalidateTag("featured-collection", "max"); // Invalidate unstable_cache

    return { success: true };
  } catch (error) {
    console.error("Error updating featured collection:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}
