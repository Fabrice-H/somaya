import type { AboutCollectionData } from "../../../types";
import { cardStyle } from "./styles";

export function CollectionsPreview({ collections }: { collections: AboutCollectionData[] }) {
  const active = collections.filter((collection) => collection.isActive);

  return (
    <div className="bg-white" style={cardStyle}>
      <h2 className="text-base font-semibold text-[#000000] mb-2">Aperçu</h2>
      <p className="text-sm text-[#6b6b6b] mb-4">Rendu sur la page &quot;Notre Histoire&quot;</p>

      {active.length === 0 ? (
        <div className="text-center py-12 bg-[#fafafa]">
          <p className="text-[#6b6b6b] text-sm">Aucune collection active à afficher</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {active.map((collection, index) => (
            <div
              key={collection.id}
              className="relative aspect-[3/4] flex flex-col justify-end p-3 overflow-hidden"
              style={{ backgroundColor: collection.backgroundColor }}
            >
              <span className="absolute top-2 right-2 text-white/40 text-[9px]">{collection.year}</span>
              <span className="text-[8px] text-white tracking-widest uppercase mb-0.5">
                Collection {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-white text-sm font-serif leading-tight">{collection.name}</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-[#6b6b6b] mt-4">
        Les collections sont affichées dans l&apos;ordre défini ci-contre. Utilisez les flèches pour réorganiser.
      </p>
    </div>
  );
}
