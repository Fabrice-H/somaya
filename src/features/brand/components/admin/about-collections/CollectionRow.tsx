import { ChevronDown, ChevronUp, Eye, EyeOff, Trash2 } from "lucide-react";
import { Badge } from "@/shared/components/admin/ui/Badge";
import type { AboutCollectionData, CollectionPatch } from "../../../types";
import { ColorSelect } from "./ColorSelect";

const fieldClass =
  "h-10 w-full border border-[var(--som-border-input)] bg-white px-3 text-[14px] font-light text-[var(--som-ink)] outline-none transition-colors hover:border-[var(--som-border-input-hover)] focus:border-[var(--som-ink)]";
const moveClass =
  "flex h-8 w-9 cursor-pointer items-center justify-center text-[var(--som-gray)] transition-colors hover:text-[var(--som-ink)] disabled:cursor-not-allowed disabled:opacity-30";
const actionClass =
  "flex h-10 w-10 cursor-pointer items-center justify-center border border-transparent text-[var(--som-gray)] transition-colors";

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
  const visibilityLabel = collection.isActive ? "Masquer la collection" : "Afficher la collection";

  return (
    <li
      className="flex items-center gap-3 border-b border-[var(--som-border)] px-3 py-4 transition-opacity last:border-b-0 lg:px-4"
      style={{ opacity: saving ? 0.6 : 1 }}
    >
      <div className="flex shrink-0 flex-col">
        <button type="button" onClick={() => onMove("up")} disabled={isFirst} aria-label="Monter" className={moveClass}>
          <ChevronUp size={16} strokeWidth={1.5} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => onMove("down")}
          disabled={isLast}
          aria-label="Descendre"
          className={moveClass}
        >
          <ChevronDown size={16} strokeWidth={1.5} aria-hidden />
        </button>
      </div>

      <span
        aria-hidden
        className="h-9 w-9 shrink-0 rounded-full border border-[var(--som-border)]"
        style={{ backgroundColor: collection.backgroundColor }}
      />

      <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[minmax(0,1fr)_88px_minmax(0,150px)]">
        <input
          type="text"
          value={collection.name}
          onChange={(event) => onEdit({ name: event.target.value })}
          onBlur={(event) => onSave({ name: event.target.value })}
          aria-label="Nom de la collection"
          placeholder="Nom"
          className={`${fieldClass} font-normal`}
        />
        <input
          type="text"
          inputMode="numeric"
          value={collection.year}
          onChange={(event) => onEdit({ year: event.target.value })}
          onBlur={(event) => onSave({ year: event.target.value })}
          aria-label="Année"
          placeholder="Année"
          className={`${fieldClass} tabular-nums`}
        />
        <ColorSelect
          value={collection.backgroundColor}
          onChange={(backgroundColor) => onSave({ backgroundColor })}
          ariaLabel="Couleur de fond"
          className={fieldClass}
        />
      </div>

      <div className="hidden w-[84px] shrink-0 justify-center md:flex">
        <Badge tone={collection.isActive ? "success" : "neutral"}>{collection.isActive ? "Visible" : "Masquée"}</Badge>
      </div>

      <div className="flex shrink-0 items-center">
        <button
          type="button"
          onClick={() => onSave({ isActive: !collection.isActive })}
          aria-label={visibilityLabel}
          title={visibilityLabel}
          className={`${actionClass} hover:text-[var(--som-ink)]`}
        >
          {collection.isActive ? (
            <Eye size={17} strokeWidth={1.5} aria-hidden />
          ) : (
            <EyeOff size={17} strokeWidth={1.5} aria-hidden />
          )}
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Supprimer la collection"
          title="Supprimer"
          className={`${actionClass} hover:text-[var(--som-error)]`}
        >
          <Trash2 size={17} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </li>
  );
}
