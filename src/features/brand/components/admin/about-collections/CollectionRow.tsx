import clsx from "clsx";
import { ChevronDown, ChevronUp, Eye, EyeOff, Trash2 } from "lucide-react";
import type { AboutCollectionData, CollectionPatch } from "../../../types";
import { ColorSelect } from "./ColorSelect";

const smallFieldClass = "bg-white border border-black text-[#000000] outline-none focus:border-black";
const arrowClass = "p-1 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed";

type CollectionRowProps = {
  collection: AboutCollectionData;
  isFirst: boolean;
  isLast: boolean;
  saving: boolean;
  onEdit: (patch: CollectionPatch) => void;
  onSave: (patch: CollectionPatch) => void;
  onMove: (direction: "up" | "down") => void;
  onDelete: () => void;
};

export function CollectionRow({
  collection,
  isFirst,
  isLast,
  saving,
  onEdit,
  onSave,
  onMove,
  onDelete,
}: CollectionRowProps) {
  return (
    <div
      className="flex items-center gap-3 p-3 bg-[#fafafa] border border-black transition-opacity"
      style={{ opacity: saving ? 0.6 : 1 }}
    >
      <div className="flex flex-col gap-0.5">
        <button type="button" onClick={() => onMove("up")} disabled={isFirst} className={arrowClass} title="Monter">
          <ChevronUp size={14} className="text-[#6b6b6b]" />
        </button>
        <button type="button" onClick={() => onMove("down")} disabled={isLast} className={arrowClass} title="Descendre">
          <ChevronDown size={14} className="text-[#6b6b6b]" />
        </button>
      </div>

      <div className="w-10 h-12 flex-shrink-0" style={{ backgroundColor: collection.backgroundColor }} />

      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={collection.name}
          onChange={(event) => onEdit({ name: event.target.value })}
          onBlur={(event) => onSave({ name: event.target.value })}
          className={`w-full h-9 px-3 text-sm ${smallFieldClass}`}
          placeholder="Nom"
        />
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={collection.year}
            onChange={(event) => onEdit({ year: event.target.value })}
            onBlur={(event) => onSave({ year: event.target.value })}
            className={`w-20 h-8 px-2 text-xs ${smallFieldClass}`}
            placeholder="Année"
          />
          <ColorSelect
            value={collection.backgroundColor}
            onChange={(backgroundColor) => onSave({ backgroundColor })}
            className={`flex-1 h-8 px-2 text-xs ${smallFieldClass}`}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSave({ isActive: !collection.isActive })}
        className={clsx(
          "p-2 transition-colors",
          collection.isActive ? "text-green-600 hover:bg-green-50" : "text-[#6b6b6b] hover:bg-white"
        )}
        title={collection.isActive ? "Visible" : "Masqué"}
      >
        {collection.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="p-2 text-red-500 hover:bg-red-50 transition-colors"
        title="Supprimer"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
