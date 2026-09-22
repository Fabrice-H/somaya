import type { SegmentRules } from "@/features/customers/types";

export type LoyaltyLevel = "new" | "regular" | "loyal" | "vip";

export type LoyaltyLevelRule = { key: LoyaltyLevel; label: string; minPoints: number };

export type LoyaltyTransactionType = "earn" | "revoke" | "adjust";

export type LoyaltySettingsData = {
  isEnabled: boolean;
  pointsPerStep: number;
  amountStep: number;
  levels: LoyaltyLevelRule[];
  segmentRules: SegmentRules;
};

export type LoyaltySettingsInput = LoyaltySettingsData;

export interface LoyaltyTransactionDto {
  id: string;
  type: LoyaltyTransactionType;
  points: number;
  reason: string | null;
  actor_email: string | null;
  order_id: string | null;
  order_number: string | null;
  created_at: string;
}

export interface LoyaltyTopCustomer {
  id: string;
  full_name: string;
  phone: string;
  loyalty_points: number;
  loyalty_level: LoyaltyLevel;
  orders_count: number;
}

export interface LoyaltyRecentTransaction extends LoyaltyTransactionDto {
  customer_id: string;
  customer_name: string;
}

export interface LoyaltyStats {
  members: number;
  pointsEarned: number;
  pointsRevoked: number;
  pointsAdjusted: number;
  levelCounts: Record<LoyaltyLevel, number>;
  deliveredWithoutPoints: number;
}

export interface LoyaltyOverview {
  settings: LoyaltySettingsData;
  stats: LoyaltyStats;
  topCustomers: LoyaltyTopCustomer[];
  recent: LoyaltyRecentTransaction[];
}

export type LoyaltyActionResult = { ok: true; message?: string } | { ok: false; error: string };
