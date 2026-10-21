import Image from "next/image";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { parseNumberInput } from "@/features/lots/utils";
import type { PriceLotItem } from "@/features/lots/types";

type LotItemCardProps = {
  item: PriceLotItem;
  index: number;
  isUploading: boolean;
  onUpdate: (updates: Partial<PriceLotItem>) => void;
  onRemove: () => void;
  onUpload: (file: File) => void;
};

export function LotItemCard({ item, index, isUploading, onUpdate, onRemove, onUpload }: LotItemCardProps) {
  const labelId = `lot-item-${item.id}-label`;
  const stockId = `lot-item-${item.id}-stock`;

  return (
    <div className="flex flex-col border border-[var(--som-border)] bg-white">
      <div className="relative aspect-square bg-[var(--som-primary-50)]">
        {item.image ? (
          <>
            <Image
              src={item.image}
              alt={item.label || `Article ${index + 1}`}
              fill
              className="object-cover"
              sizes="240px"
            />
            <button
              type="button"
              onClick={() => onUpdate({ image: "" })}
              aria-label="Retirer l'image"
              className="absolute right-2 top-2 inline-flex h-10 w-10 cursor-pointer items-center justify-center bg-white text-[var(--som-ink)] transition-colors hover:text-[var(--som-error)]"
            >
              <X size={16} strokeWidth={1.5} aria-hidden />
            </button>
          </>
        ) : (
          <label className="absolute inset-2 flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-[var(--som-border-strong)] bg-[var(--som-surface-alt)] text-[var(--som-gray)] transition-colors hover:border-[var(--som-primary)] hover:text-[var(--som-primary)]">
            {isUploading ? (
              <Loader2 size={20} strokeWidth={1.4} className="animate-spin" aria-hidden />
            ) : (
              <>
                <ImagePlus size={20} strokeWidth={1.4} aria-hidden />
                <span className="text-[11px] uppercase tracking-[0.16em]">Ajouter une image</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
              }}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="space-y-4 border-t border-[var(--som-border)] p-4">
        <div>
          <label htmlFor={labelId} className="label-som">
            Libellé
          </label>
          <input
            id={labelId}
            type="text"
            value={item.label || ""}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Optionnel"
            className="input-som"
          />
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label htmlFor={stockId} className="label-som">
              Stock
            </label>
            <input
              id={stockId}
              type="number"
              value={item.stock || ""}
              onChange={(e) => onUpdate({ stock: parseNumberInput(e.target.value) })}
              min="0"
              placeholder="0"
              className="input-som tabular-nums"
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Supprimer l'article"
            className="inline-flex h-[52px] w-11 shrink-0 cursor-pointer items-center justify-center text-[var(--som-gray)] transition-colors hover:bg-[var(--som-error-tint)] hover:text-[var(--som-error)]"
          >
            <Trash2 size={15} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
