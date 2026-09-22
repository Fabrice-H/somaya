import type { Customer } from "@/shared/lib/db/schema";
import type { LoyaltyLevel } from "@/features/loyalty/constants";
import { LOYALTY_LEVELS } from "@/features/loyalty/constants";
import { computeSegment } from "../segments";
import type { CustomerSummary, SegmentRules } from "../types";

const toLoyaltyLevel = (value: string): LoyaltyLevel => LOYALTY_LEVELS.find((level) => level === value) ?? "new";

export function toCustomerSummary(row: Customer, rules: SegmentRules, now = new Date()): CustomerSummary {
  const totalSpent = Number(row.totalSpent);
  return {
    id: row.id,
    first_name: row.firstName,
    last_name: row.lastName,
    full_name: `${row.firstName} ${row.lastName}`.trim(),
    phone: row.phone,
    email: row.email,
    orders_count: row.ordersCount,
    total_spent: totalSpent,
    first_order_at: row.firstOrderAt?.toISOString() ?? null,
    last_order_at: row.lastOrderAt?.toISOString() ?? null,
    loyalty_points: row.loyaltyPoints,
    loyalty_level: toLoyaltyLevel(row.loyaltyLevel),
    segment: computeSegment(
      { ordersCount: row.ordersCount, totalSpent, firstOrderAt: row.firstOrderAt, lastOrderAt: row.lastOrderAt },
      rules,
      now
    ),
    created_at: row.createdAt.toISOString(),
  };
}
