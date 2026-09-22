import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Badge } from "@/shared/components/admin/ui/Badge";
import { LOYALTY_LEVEL_BADGES } from "@/features/loyalty/constants";
import type { CustomerDetail } from "../../../types";

export function CustomerLoyaltyCard({ customer }: { customer: CustomerDetail }) {
  const level = LOYALTY_LEVEL_BADGES[customer.loyalty_level];
  return (
    <AdminCard title="Fidélité">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="m-0 text-[11px] uppercase tracking-[0.18em] text-[var(--som-gray)]">Points</p>
          <p className="m-0 mt-2 text-[30px] font-light leading-none tabular-nums text-[var(--som-ink)]">
            {customer.loyalty_points}
          </p>
        </div>
        <Badge tone={level.tone}>{level.label}</Badge>
      </div>
      <p className="m-0 mt-4 text-[12px] font-light leading-relaxed text-[var(--som-gray)]">
        Les points sont attribués quand une commande est livrée.
      </p>
    </AdminCard>
  );
}
