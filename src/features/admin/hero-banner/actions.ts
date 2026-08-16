"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db, heroBanner } from "@/lib/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/actions";

// Fixed ID for singleton hero banner
const HERO_BANNER_ID = "00000000-0000-0000-0000-000000000003";

export type HeroBannerData = {
  id: string;
  layout: string;
  eyebrow: string | null;
  title: string | null;
  title_highlight: string | null;
  title_suffix: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  media_type: string;
  media_url: string | null;
  media_position: string | null;
  background_color: string | null;
  text_color: string | null;
  accent_color: string | null;
  is_active: boolean;
};

function toHeroBannerData(data: typeof heroBanner.$inferSelect): HeroBannerData {
  return {
    id: data.id,
    layout: data.layout,
    eyebrow: data.eyebrow,
    title: data.title,
    title_highlight: data.titleHighlight,
    title_suffix: data.titleSuffix,
    description: data.description,
    button_text: data.buttonText,
    button_link: data.buttonLink,
    media_type: data.mediaType,
    media_url: data.mediaUrl,
    media_position: data.mediaPosition,
    background_color: data.backgroundColor,
    text_color: data.textColor,
    accent_color: data.accentColor,
    is_active: data.isActive,
  };
}

/**
 * Get hero banner data for admin
 */
export async function getHeroBanner(): Promise<HeroBannerData | null> {
  const result = await db.query.heroBanner.findFirst({
    where: eq(heroBanner.id, HERO_BANNER_ID),
  });

  if (!result) return null;
  return toHeroBannerData(result);
}

/**
 * Get hero banner for public display
 */
export async function getHeroBannerPublic(): Promise<HeroBannerData | null> {
  const result = await db.query.heroBanner.findFirst({
    where: eq(heroBanner.id, HERO_BANNER_ID),
  });

  if (!result || !result.isActive) return null;
  return toHeroBannerData(result);
}

/**
 * Update hero banner
 */
export async function updateHeroBanner(
  data: Partial<Omit<HeroBannerData, "id">>
): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  try {
    // Check if hero banner exists
    const existing = await db.query.heroBanner.findFirst({
      where: eq(heroBanner.id, HERO_BANNER_ID),
    });

    const updateData = {
      layout: data.layout,
      eyebrow: data.eyebrow,
      title: data.title,
      titleHighlight: data.title_highlight,
      titleSuffix: data.title_suffix,
      description: data.description,
      buttonText: data.button_text,
      buttonLink: data.button_link,
      mediaType: data.media_type,
      mediaUrl: data.media_url,
      mediaPosition: data.media_position,
      backgroundColor: data.background_color,
      textColor: data.text_color,
      accentColor: data.accent_color,
      isActive: data.is_active,
      updatedAt: new Date(),
    };

    if (existing) {
      await db
        .update(heroBanner)
        .set(updateData)
        .where(eq(heroBanner.id, HERO_BANNER_ID));
    } else {
      await db.insert(heroBanner).values({
        id: HERO_BANNER_ID,
        ...updateData,
      });
    }

    revalidatePath("/admin/hero-banner");
    revalidateTag("hero-banner", "max");

    return { success: true };
  } catch (error) {
    console.error("Error updating hero banner:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}
