import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Badge } from "@/shared/components/admin/ui/Badge";
import { LOYALTY_LEVEL_BADGES } from "../../constants";
import { orderedLevels } from "../../rules";
import type { LoyaltyLevel, LoyaltyLevelRule } from "../../types";

export function LoyaltyLevelsCard({
  levels,
  counts,
}: {
  levels: LoyaltyLevelRule[];
  counts: Record<LoyaltyLevel, number>;
}) {
  const ordered = orderedLevels(levels);
  return (
    <AdminCard title="Niveaux" description="Répartition des clients par palier de points.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ordered.map((level, index) => {
          const next = ordered[index + 1];
          return (
            <div key={level.key} className="border border-[var(--som-border)] p-4">
              <Badge tone={LOYALTY_LEVEL_BADGES[level.key].tone}>{level.label}</Badge>
              <p className="m-0 mt-3 text-[24px] font-light leading-none tabular-nums text-[var(--som-ink)]">
                {counts[level.key]}
              </p>
              <p className="m-0 mt-2 text-[12px] font-light text-[var(--som-gray)]">
                {next ? `${level.minPoints} à ${next.minPoints - 1} points` : `${level.minPoints} points et plus`}
              </p>
            </div>
          );
        })}
      </div>
    </AdminCard>
  );
}
