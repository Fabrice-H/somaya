import Image from "next/image";
import clsx from "clsx";
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
      className={clsx(
        "relative group aspect-square rounded-lg overflow-hidden border-2",
        dragging ? "border-[#511f29] opacity-50" : "border-transparent"
      )}
    >
      <Image src={url} alt={`Image ${index + 1}`} fill sizes="200px" className="object-cover" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <div className="cursor-move p-2 bg-white/90 rounded-lg text-[#3c161e]">
          <GripVertical size={18} />
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Supprimer l'image"
          className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600"
        >
          <X size={18} />
        </button>
      </div>
      {index === 0 && (
        <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#511f29] text-white text-xs rounded">Principale</span>
      )}
    </div>
  );
}
