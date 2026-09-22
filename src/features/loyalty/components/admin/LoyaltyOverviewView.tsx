import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import type { LoyaltyOverview } from "../../types";
import { LoyaltyBackfillCard } from "./LoyaltyBackfillCard";
import { LoyaltyLevelsCard } from "./LoyaltyLevelsCard";
import { LoyaltySettingsForm } from "./LoyaltySettingsForm";
import { LoyaltyStatsRow } from "./LoyaltyStatsRow";
import { LoyaltyTopCustomersCard } from "./LoyaltyTopCustomersCard";
import { LoyaltyTransactionsCard } from "./LoyaltyTransactionsCard";

export function LoyaltyOverviewView({ overview }: { overview: LoyaltyOverview }) {
  return (
    <AdminPage
      eyebrow="Ventes"
      title="Fidélité"
      description="Points gagnés sur les commandes livrées, niveaux et règles du programme."
    >
      <LoyaltyStatsRow stats={overview.stats} enabled={overview.settings.isEnabled} />

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <LoyaltyLevelsCard levels={overview.settings.levels} counts={overview.stats.levelCounts} />
          <LoyaltyTopCustomersCard customers={overview.topCustomers} />
          <LoyaltyTransactionsCard transactions={overview.recent} />
        </div>
        <div className="space-y-6">
          {overview.stats.deliveredWithoutPoints > 0 && (
            <LoyaltyBackfillCard pending={overview.stats.deliveredWithoutPoints} />
          )}
          <LoyaltySettingsForm settings={overview.settings} />
        </div>
      </div>
    </AdminPage>
  );
}
