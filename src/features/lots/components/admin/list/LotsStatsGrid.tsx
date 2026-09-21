import clsx from "clsx";
import type { LotsStats } from "@/features/lots/types";

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  hint: string;
  highlighted?: boolean;
  accent?: boolean;
};

function StatCard({ label, value, hint, highlighted, accent }: StatCardProps) {
  return (
    <div
      className={clsx(
        "rounded-lg p-5 border",
        highlighted ? "bg-[#f5ebe3] border-[#e0d0c4]" : "bg-[#fafafa] border-[#e8ddd4]"
      )}
    >
      <p
        className={clsx(
          "text-[10px] font-medium tracking-[0.12em] uppercase mb-3",
          accent ? "text-[#7a3d48]" : "text-[#6b6b6b]"
        )}
      >
        {label}
      </p>
      <p
        className={clsx(
          "font-[family-name:var(--font-stack)] text-4xl mb-1",
          accent ? "text-[#7a3d48]" : "text-[#000000]"
        )}
      >
        {value}
      </p>
      <p className="text-[13px] text-[#6b6b6b]">{hint}</p>
    </div>
  );
}

export function LotsStatsGrid({ stats }: { stats: LotsStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard label="LOTS ACTIFS" value={`${stats.active}/${stats.total}`} hint="Visibles sur /lots" />
      <StatCard label="ARTICLES EN LIGNE" value={stats.articles} hint="Toutes catégories" />
      <StatCard label="STOCK TOTAL" value={stats.stock} hint="Suivi à l'unité" highlighted />
      <StatCard label="ARTICLES ÉPUISÉS" value={stats.outOfStock} hint="Affichés « Épuisé »" highlighted accent />
    </div>
  );
}
