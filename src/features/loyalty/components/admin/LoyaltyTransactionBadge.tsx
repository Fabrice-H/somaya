import { Badge } from "@/shared/components/admin/ui/Badge";
import { LOYALTY_TRANSACTION_LABELS } from "../../constants";
import type { LoyaltyTransactionType } from "../../types";

export function LoyaltyTransactionBadge({ type }: { type: LoyaltyTransactionType }) {
  const config = LOYALTY_TRANSACTION_LABELS[type];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}

export function PointsDelta({ points }: { points: number }) {
  return (
    <span
      className={`min-w-[56px] text-right text-[14px] font-medium tabular-nums ${
        points >= 0 ? "text-[var(--som-success)]" : "text-[var(--som-error)]"
      }`}
    >
      {points > 0 ? `+${points}` : points}
    </span>
  );
}
