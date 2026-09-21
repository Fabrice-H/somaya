"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db, storeSettings } from "@/shared/lib/db";
import { requireAdmin } from "@/features/auth/server/session";
import { SETTINGS_CACHE_TAG, STORE_SETTINGS_ID } from "../constants";
import { settingsSchema } from "../schemas";
import type { ActionResult, SettingsInput } from "../types";

export async function updateSettings(input: SettingsInput): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "Non autorisé" };

  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };

  const data = parsed.data;
  const values = {
    storeName: data.store_name,
    tagline: data.tagline,
    logoUrl: data.logo_url,
    whatsappNumber: data.whatsapp_number,
    phoneNumber: data.phone_number,
    email: data.email,
    address: data.address,
    instagramHandle: data.instagram_handle,
    facebookUrl: data.facebook_url,
    tiktokHandle: data.tiktok_handle,
    deliveryFee: String(data.delivery_fee),
    deliveryHours: data.delivery_hours,
    primaryColor: data.primary_color,
    secondaryColor: data.secondary_color,
    updatedAt: new Date(),
  };

  try {
    const existing = await db.query.storeSettings.findFirst({ columns: { id: true } });
    if (existing) await db.update(storeSettings).set(values).where(eq(storeSettings.id, existing.id));
    else await db.insert(storeSettings).values({ id: STORE_SETTINGS_ID, ...values });
  } catch {
    return { success: false, error: "Erreur lors de la mise à jour" };
  }

  revalidateTag(SETTINGS_CACHE_TAG, "max");
  return { success: true };
}
