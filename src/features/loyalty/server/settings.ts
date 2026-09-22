import "server-only";
import { unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";
import { db, loyaltySettings } from "@/shared/lib/db";
import { DEFAULT_LOYALTY_SETTINGS, LOYALTY_CACHE_TAG, LOYALTY_SETTINGS_ID } from "../constants";
import { loyaltySettingsSchema } from "../schemas";
import type { LoyaltySettingsData } from "../types";

export async function getLoyaltySettings(): Promise<LoyaltySettingsData> {
  const row = await db.query.loyaltySettings.findFirst({ where: eq(loyaltySettings.id, LOYALTY_SETTINGS_ID) });
  if (!row) return DEFAULT_LOYALTY_SETTINGS;
  const parsed = loyaltySettingsSchema.safeParse({
    isEnabled: row.isEnabled,
    pointsPerStep: row.pointsPerStep,
    amountStep: row.amountStep,
    levels: row.levels ?? DEFAULT_LOYALTY_SETTINGS.levels,
    segmentRules: row.segmentRules ?? DEFAULT_LOYALTY_SETTINGS.segmentRules,
  });
  return parsed.success ? parsed.data : DEFAULT_LOYALTY_SETTINGS;
}

export const getPublicLoyaltySettings = unstable_cache(getLoyaltySettings, ["loyalty-settings"], {
  revalidate: 300,
  tags: [LOYALTY_CACHE_TAG],
});
