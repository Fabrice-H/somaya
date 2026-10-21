import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import type { AboutCollectionData } from "../../../types";

export function CollectionsPreview({ collections }: { collections: AboutCollectionData[] }) {
  const active = collections.filter((collection) => collection.isActive);

  return (
    <AdminCard title="Aperçu" description="Rendu sur la page « Notre Histoire ».">
      {active.length === 0 ? (
        <p className="m-0 border border-dashed border-[var(--som-border-strong)] bg-[var(--som-surface-alt)] px-6 py-12 text-center text-[13px] font-light text-[var(--som-gray)]">
          Aucune collection active à afficher.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {active.map((collection, index) => (
            <div
              key={collection.id}
              className="relative flex aspect-[3/4] flex-col justify-end overflow-hidden p-3"
              style={{ backgroundColor: collection.backgroundColor }}
            >
              <span className="absolute right-2 top-2 text-[9px] tabular-nums text-white/50">{collection.year}</span>
              <span className="mb-0.5 text-[8px] uppercase tracking-[0.2em] text-white/80">
                Collection {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[13px] leading-tight text-white">{collection.name}</span>
            </div>
          ))}
        </div>
      )}
      <p className="m-0 mt-4 text-[12px] font-light text-[var(--som-gray)]">
        Les collections apparaissent dans l&apos;ordre de la liste.
      </p>
    </AdminCard>
  );
}
