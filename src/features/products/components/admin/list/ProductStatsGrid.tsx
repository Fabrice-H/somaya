import { AlertTriangle, Eye, EyeOff, PackageX } from "lucide-react";
import { StatCard } from "@/shared/components/admin/ui/StatCard";
import type { ProductStats } from "@/features/products/types";

export function ProductStatsGrid({ stats }: { stats: ProductStats }) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard label="En ligne" value={stats.active} hint="Visibles dans la boutique" icon={Eye} />
      <StatCard label="Masqués" value={stats.total - stats.active} hint="Invisibles pour les clientes" icon={EyeOff} />
      <StatCard label="Stock faible" value={stats.lowStock} hint="Bientôt épuisés" icon={AlertTriangle} />
      <StatCard label="Épuisés" value={stats.outOfStock} hint="À réapprovisionner" icon={PackageX} tone="primary" />
    </div>
  );
}
