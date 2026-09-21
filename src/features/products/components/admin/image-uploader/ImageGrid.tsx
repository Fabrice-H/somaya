"use client";

import { useState, type DragEvent } from "react";
import { ImagePreview } from "./ImagePreview";

interface ImageGridProps {
  images: string[];
  onRemove: (url: string) => Promise<void>;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function ImageGrid({ images, onRemove, onReorder }: ImageGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    onReorder(draggedIndex, index);
    setDraggedIndex(index);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {images.map((url, index) => (
        <ImagePreview
          key={url}
          url={url}
          index={index}
          isDragging={draggedIndex === index}
          onRemove={() => onRemove(url)}
          onDragStart={() => setDraggedIndex(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={() => setDraggedIndex(null)}
        />
      ))}
    </div>
  );
}
