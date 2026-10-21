import { Package, Plus } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { EmptyState } from "@/shared/components/admin/ui/EmptyState";
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
    <AdminCard
      title="Articles"
      description={`${items.length} article${items.length > 1 ? "s" : ""} dans ce lot`}
      action={
        items.length > 0 && (
          <button type="button" onClick={onAdd} className="btn-secondary btn-sm">
            <Plus size={15} strokeWidth={1.5} aria-hidden />
            Ajouter
          </button>
        )
      }
    >
      {items.length === 0 ? (
        <div className="border border-dashed border-[var(--som-border-strong)] bg-[var(--som-surface-alt)]">
          <EmptyState
            icon={Package}
            title="Aucun article dans ce lot"
            description="Ajoutez les pièces proposées à ce prix, avec leur photo et leur stock."
            action={
              <button type="button" onClick={onAdd} className="btn-primary btn-sm">
                <Plus size={15} strokeWidth={1.5} aria-hidden />
                Ajouter le premier article
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
    </AdminCard>
  );
}
