import { Boxes, Layers, Package, PackageX } from "lucide-react";
import { StatCard } from "@/shared/components/admin/ui/StatCard";
import type { LotsStats } from "@/features/lots/types";

export function LotsStatsGrid({ stats }: { stats: LotsStats }) {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Lots actifs" value={`${stats.active}/${stats.total}`} hint="Visibles sur /lots" icon={Layers} />
      <StatCard label="Articles en ligne" value={stats.articles} hint="Toutes catégories" icon={Package} />
      <StatCard label="Stock total" value={stats.stock} hint="Suivi à l'unité" icon={Boxes} />
      <StatCard
        label="Articles épuisés"
        value={stats.outOfStock}
        hint="Affichés « Épuisé »"
        icon={PackageX}
        tone="primary"
      />
    </div>
  );
}
