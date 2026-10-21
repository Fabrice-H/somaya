import type { CustomerSegment, CustomerStatsInput, SegmentRules } from "./types";

const DAY_MS = 86_400_000;

export const daysAgo = (days: number, now: Date) => new Date(now.getTime() - days * DAY_MS);

export function computeSegment(stats: CustomerStatsInput, rules: SegmentRules, now = new Date()): CustomerSegment {
  if (stats.totalSpent >= rules.vipSpent || stats.ordersCount >= rules.vipOrders) return "vip";
  if (stats.ordersCount >= rules.loyalOrders) return "loyal";
  if (stats.ordersCount === 1 && stats.firstOrderAt && stats.firstOrderAt >= daysAgo(rules.newDays, now)) return "new";
  if (!stats.lastOrderAt || stats.lastOrderAt < daysAgo(rules.inactiveDays, now)) return "inactive";
  return "active";
}
