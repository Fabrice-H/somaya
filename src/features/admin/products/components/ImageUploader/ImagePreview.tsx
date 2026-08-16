"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { X, GripVertical, Loader2 } from "lucide-react";
import clsx from "clsx";

interface ImagePreviewProps {
  url: string;
  index: number;
  isPrimary: boolean;
  isDragging: boolean;
  onRemove: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

export const ImagePreview = memo(function ImagePreview({
  url,
  index,
  isPrimary,
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
        "relative group aspect-square rounded-lg overflow-hidden border-2 transition-all",
        isDragging
          ? "border-[#511F29] opacity-50 scale-95"
          : "border-transparent hover:border-[#511F29]/30",
        isDeleting && "pointer-events-none opacity-50"
      )}
    >
      <Image
        src={url}
        alt={`Image ${index + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, 33vw"
      />

      {/* Overlay with actions */}
      <div
        className={clsx(
          "absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center gap-2",
          isDeleting ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        {isDeleting ? (
          <Loader2 size={24} className="text-white animate-spin" />
        ) : (
          <>
            <div className="cursor-move p-2 bg-white/90 rounded-lg text-[#511F29] hover:bg-white transition-colors">
              <GripVertical size={18} />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
            >
              <X size={18} />
            </button>
          </>
        )}
      </div>

      {/* Primary badge */}
      {isPrimary && (
        <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#511F29] text-white text-xs rounded font-medium">
          Principale
        </span>
      )}
    </div>
  );
});
