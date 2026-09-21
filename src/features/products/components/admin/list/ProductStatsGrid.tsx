import type { ProductStats } from "@/features/products/types";

const STAT_ITEMS = [
  { key: "total", label: "Total produits", color: "text-[#000000]" },
  { key: "active", label: "Actifs", color: "text-green-600" },
  { key: "lowStock", label: "Stock faible", color: "text-amber-600" },
  { key: "outOfStock", label: "Épuisés", color: "text-red-600" },
] as const satisfies readonly { key: keyof ProductStats; label: string; color: string }[];

export function ProductStatsGrid({ stats }: { stats: ProductStats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8" style={{ maxWidth: 800 }}>
      {STAT_ITEMS.map(({ key, label, color }) => (
        <div key={key} className="bg-[#fafafa] border border-black p-4">
          <div className={`text-2xl font-bold ${color}`}>{stats[key]}</div>
          <div className="text-xs text-[#6b6b6b] mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
}
