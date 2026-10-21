import { Award, Gift, RotateCcw, Users } from "lucide-react";
import { StatCard } from "@/shared/components/admin/ui/StatCard";
import type { LoyaltyStats } from "../../types";

export function LoyaltyStatsRow({ stats, enabled }: { stats: LoyaltyStats; enabled: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Membres" value={stats.members} hint="Clients avec des points" icon={Users} />
      <StatCard
        label="Points distribués"
        value={stats.pointsEarned}
        hint={enabled ? "Sur les commandes livrées" : "Programme désactivé"}
        icon={Gift}
        tone="primary"
      />
      <StatCard
        label="Points retirés"
        value={stats.pointsRevoked}
        hint="Commandes annulées après livraison"
        icon={RotateCcw}
      />
      <StatCard
        label="Ajustements"
        value={stats.pointsAdjusted > 0 ? `+${stats.pointsAdjusted}` : stats.pointsAdjusted}
        hint="Ajouts ou retraits manuels"
        icon={Award}
      />
    </div>
  );
}
