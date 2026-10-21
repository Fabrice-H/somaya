import Image from "next/image";
import { GripVertical, X } from "lucide-react";

type ImageTileProps = {
  url: string;
  index: number;
  dragging: boolean;
  onDragStart: () => void;
  onDragOver: () => void;
  onDragEnd: () => void;
  onRemove: () => void;
};

const iconButton =
  "flex h-9 w-9 items-center justify-center border border-[var(--som-border)] bg-white text-[var(--som-ink)] transition-colors";

export function ImageTile({ url, index, dragging, onDragStart, onDragOver, onDragEnd, onRemove }: ImageTileProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOver();
      }}
      onDragEnd={onDragEnd}
      className={`group relative aspect-square overflow-hidden border bg-[var(--som-surface-alt)] ${
        dragging ? "border-[var(--som-primary)] opacity-50" : "border-[var(--som-border)]"
      }`}
    >
      <Image src={url} alt={`Image ${index + 1}`} fill sizes="200px" className="object-cover" />
      <div className="absolute right-2 top-2 flex gap-1.5 transition-opacity lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
        <span aria-hidden className={`${iconButton} cursor-move`}>
          <GripVertical size={15} strokeWidth={1.5} />
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Supprimer l'image"
          className={`${iconButton} cursor-pointer hover:border-[var(--som-error)] hover:text-[var(--som-error)]`}
        >
          <X size={15} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
      {index === 0 && (
        <span className="absolute bottom-2 left-2 bg-white px-2 py-1 text-[10px] font-medium uppercase leading-none tracking-[0.14em] text-[var(--som-primary)]">
          Principale
        </span>
      )}
    </div>
  );
}
