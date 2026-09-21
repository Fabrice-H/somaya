import { Package, Plus } from "lucide-react";
import { LotItemCard } from "./LotItemCard";
import type { PriceLotItem } from "@/features/lots/types";

type LotItemsSectionProps = {
  items: PriceLotItem[];
  uploadingIds: ReadonlySet<string>;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<PriceLotItem>) => void;
  onUpload: (id: string, file: File) => void;
};

export function LotItemsSection({ items, uploadingIds, onAdd, onRemove, onUpdate, onUpload }: LotItemsSectionProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[#3c161e]">Articles ({items.length})</h3>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 h-9 px-4 bg-[#fafafa] text-[#3c161e] text-sm font-medium hover:bg-[#f0e8e0] transition-colors"
        >
          <Plus size={16} />
          Ajouter un article
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-[var(--som-border)]">
          <Package size={48} className="mx-auto text-[#3c161e]/20 mb-4" />
          <p className="text-[#6b6b6b] mb-4">Aucun article dans ce lot</p>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 h-10 px-5 bg-[#511f29] text-white text-sm font-medium hover:bg-[#3d171f] transition-colors"
          >
            <Plus size={16} />
            Ajouter le premier article
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <LotItemCard
              key={item.id}
              item={item}
              index={index}
              isUploading={uploadingIds.has(item.id)}
              onUpdate={(updates) => onUpdate(item.id, updates)}
              onRemove={() => onRemove(item.id)}
              onUpload={(file) => onUpload(item.id, file)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
