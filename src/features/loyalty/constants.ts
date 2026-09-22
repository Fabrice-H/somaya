import type { BadgeTone } from "@/shared/components/admin/ui/Badge";

export const LOYALTY_SETTINGS_ID = "00000000-0000-0000-0000-000000000004";

export const LOYALTY_LEVELS = ["new", "regular", "loyal", "vip"] as const;

export type LoyaltyLevel = (typeof LOYALTY_LEVELS)[number];

export type LoyaltyLevelRule = { key: LoyaltyLevel; label: string; minPoints: number };

export const DEFAULT_LOYALTY_LEVELS: LoyaltyLevelRule[] = [
  { key: "new", label: "Nouveau", minPoints: 0 },
  { key: "regular", label: "Habitué", minPoints: 100 },
  { key: "loyal", label: "Fidèle", minPoints: 300 },
  { key: "vip", label: "VIP", minPoints: 800 },
];

export const LOYALTY_LEVEL_BADGES: Record<LoyaltyLevel, { label: string; tone: BadgeTone }> = {
  new: { label: "Nouveau", tone: "neutral" },
  regular: { label: "Habitué", tone: "info" },
  loyal: { label: "Fidèle", tone: "primary" },
  vip: { label: "VIP", tone: "success" },
};

export const DEFAULT_POINTS_PER_STEP = 1;
export const DEFAULT_AMOUNT_STEP = 1000;
