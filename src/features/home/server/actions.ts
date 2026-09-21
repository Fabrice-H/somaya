"use server";

import { revalidateTag } from "next/cache";
import { db, heroBanner } from "@/shared/lib/db";
import { requireAdmin } from "@/features/auth/server/session";
import { HERO_BANNER_ID, HERO_CACHE_TAG } from "../constants";
import { heroBannerSchema } from "../schemas";
import type { ActionResult, HeroBannerInput } from "../types";

export async function updateHeroBanner(input: HeroBannerInput): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  const parsed = heroBannerSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };

  const data = parsed.data;
  const values = {
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

  try {
    await db
      .insert(heroBanner)
      .values({ id: HERO_BANNER_ID, ...values })
      .onConflictDoUpdate({ target: heroBanner.id, set: values });
  } catch {
    return { success: false, error: "Erreur lors de la mise à jour" };
  }

  revalidateTag(HERO_CACHE_TAG, "max");
  return { success: true };
}
