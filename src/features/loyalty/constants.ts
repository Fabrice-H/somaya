import type { BadgeTone } from "@/shared/components/admin/ui/Badge";
import { DEFAULT_SEGMENT_RULES } from "@/features/customers/constants";
import type { LoyaltyLevel, LoyaltyLevelRule, LoyaltySettingsData, LoyaltyTransactionType } from "./types";

export const LOYALTY_SETTINGS_ID = "00000000-0000-0000-0000-000000000004";
export const LOYALTY_CACHE_TAG = "loyalty";
export const LOYALTY_PATH = "/admin/loyalty";
export const LOYALTY_TOP_CUSTOMERS_LIMIT = 10;
export const LOYALTY_RECENT_TRANSACTIONS_LIMIT = 20;
export const LOYALTY_HISTORY_LIMIT = 30;
export const LOYALTY_REASON_MAX_LENGTH = 255;
export const LOYALTY_ADJUST_MAX_POINTS = 100_000;

export const LOYALTY_LEVELS = ["new", "regular", "loyal", "vip"] as const satisfies readonly LoyaltyLevel[];

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

export const DEFAULT_LOYALTY_SETTINGS: LoyaltySettingsData = {
  isEnabled: true,
  pointsPerStep: DEFAULT_POINTS_PER_STEP,
  amountStep: DEFAULT_AMOUNT_STEP,
  levels: DEFAULT_LOYALTY_LEVELS,
  segmentRules: DEFAULT_SEGMENT_RULES,
};

export const LOYALTY_TRANSACTION_TYPES = [
  "earn",
  "revoke",
  "adjust",
] as const satisfies readonly LoyaltyTransactionType[];

export const LOYALTY_TRANSACTION_LABELS: Record<LoyaltyTransactionType, { label: string; tone: BadgeTone }> = {
  earn: { label: "Commande livrée", tone: "success" },
  revoke: { label: "Commande annulée", tone: "danger" },
  adjust: { label: "Ajustement", tone: "info" },
};

export const LOYALTY_REASONS = {
  earn: "Points gagnés sur une commande livrée",
  revoke: "Commande annulée après livraison",
  backfill: "Rattrapage des commandes déjà livrées",
} as const;
