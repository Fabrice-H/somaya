"use client";

import { useState, type DragEvent } from "react";
import Image from "next/image";
import { X, GripVertical, Loader2 } from "lucide-react";
import clsx from "clsx";

interface ImagePreviewProps {
  url: string;
  index: number;
  isDragging: boolean;
  onRemove: () => Promise<void>;
  onDragStart: () => void;
  onDragOver: (e: DragEvent) => void;
  onDragEnd: () => void;
}

export function ImagePreview({
  url,
  index,
  isDragging,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
}: ImagePreviewProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemove = async () => {
    setIsDeleting(true);
    try {
      await onRemove();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      draggable={!isDeleting}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={clsx(
        "group relative aspect-[4/5] cursor-grab overflow-hidden border bg-[var(--som-primary-50)] transition-all active:cursor-grabbing",
        isDragging ? "scale-95 border-[var(--som-primary)] opacity-50" : "border-[var(--som-border)]",
        isDeleting && "pointer-events-none opacity-50"
      )}
    >
      <Image src={url} alt={`Photo ${index + 1}`} fill className="object-cover" sizes="(max-width: 640px) 50vw, 20vw" />

      {isDeleting && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Loader2 size={20} className="animate-spin text-white" aria-hidden />
        </span>
      )}

      {!isDeleting && (
        <>
          <span
            aria-hidden
            className="absolute left-1.5 top-1.5 flex h-8 w-8 items-center justify-center bg-white/90 text-[var(--som-ink)] opacity-0 transition-opacity group-hover:opacity-100"
          >
            <GripVertical size={15} strokeWidth={1.5} />
          </span>
          <button
            type="button"
            onClick={handleRemove}
            aria-label={`Retirer la photo ${index + 1}`}
            className="absolute right-1.5 top-1.5 flex h-10 w-10 cursor-pointer items-center justify-center bg-white/90 text-[var(--som-ink)] transition-colors hover:bg-white hover:text-[var(--som-error)] focus-visible:outline-2 focus-visible:outline-[var(--som-primary)]"
          >
            <X size={16} strokeWidth={1.5} aria-hidden />
          </button>
        </>
      )}

      {index === 0 && (
        <span className="absolute bottom-0 left-0 right-0 bg-[var(--som-primary)] py-1 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-white">
          Photo principale
        </span>
      )}
    </div>
  );
}
