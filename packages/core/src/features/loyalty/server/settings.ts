import { eq } from "drizzle-orm";
import { db, loyaltySettings } from "@somaya/db";
import { DEFAULT_LOYALTY_SETTINGS, LOYALTY_SETTINGS_ID } from "../constants";
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
