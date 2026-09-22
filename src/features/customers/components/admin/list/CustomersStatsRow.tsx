import { Crown, MoonStar, Sparkles, Users } from "lucide-react";
import { StatCard } from "@/shared/components/admin/ui/StatCard";
import type { CustomersStats } from "../../../types";

export function CustomersStatsRow({ stats }: { stats: CustomersStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Clients" value={stats.total} hint="Toutes périodes" icon={Users} />
      <StatCard label="Nouveaux" value={stats.new} hint="Première commande récente" icon={Sparkles} tone="primary" />
      <StatCard label="Fidèles & VIP" value={stats.loyal + stats.vip} hint={`${stats.vip} VIP`} icon={Crown} />
      <StatCard label="Inactifs" value={stats.inactive} hint="À relancer" icon={MoonStar} />
    </div>
  );
}
