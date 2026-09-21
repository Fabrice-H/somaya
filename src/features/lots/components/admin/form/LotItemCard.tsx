import Image from "next/image";
import { Loader2, Trash2, Upload, X } from "lucide-react";
import { parseNumberInput } from "@/features/lots/utils";
import type { PriceLotItem } from "@/features/lots/types";

const FIELD_CLASS =
  "w-full h-9 px-3 border border-black text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white text-[#000000]";

type LotItemCardProps = {
  item: PriceLotItem;
  index: number;
  isUploading: boolean;
  onUpdate: (updates: Partial<PriceLotItem>) => void;
  onRemove: () => void;
  onUpload: (file: File) => void;
};

export function LotItemCard({ item, index, isUploading, onUpdate, onRemove, onUpload }: LotItemCardProps) {
  return (
    <div className="border border-black overflow-hidden bg-[#fafafa]">
      <div className="relative aspect-square bg-white">
        {item.image ? (
          <>
            <Image
              src={item.image}
              alt={item.label || `Article ${index + 1}`}
              fill
              className="object-cover"
              sizes="200px"
            />
            <button
              type="button"
              onClick={() => onUpdate({ image: "" })}
              aria-label="Retirer l'image"
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-[#fafafa] transition-colors">
            {isUploading ? (
              <Loader2 size={32} className="text-[#3c161e]/30 animate-spin" />
            ) : (
              <>
                <Upload size={32} className="text-[#3c161e]/30 mb-2" />
                <span className="text-sm text-[#6b6b6b]">Ajouter image</span>
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

      <div className="p-3 space-y-2">
        <input
          type="text"
          value={item.label || ""}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Label (optionnel)"
          className={FIELD_CLASS}
        />
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="number"
              value={item.stock || ""}
              onChange={(e) => onUpdate({ stock: parseNumberInput(e.target.value) })}
              min="0"
              placeholder="Stock"
              className={FIELD_CLASS}
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Supprimer l'article"
            className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
