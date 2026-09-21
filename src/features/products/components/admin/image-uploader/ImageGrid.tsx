"use client";

import { memo, useState, useCallback } from "react";
import { ImagePreview } from "./ImagePreview";

interface ImageGridProps {
  images: string[];
  onRemove: (url: string) => Promise<void>;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export const ImageGrid = memo(function ImageGrid({
  images,
  onRemove,
  onReorder,
}: ImageGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;

      onReorder(draggedIndex, index);
      setDraggedIndex(index);
    },
    [draggedIndex, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {images.map((url, index) => (
        <ImagePreview
          key={url}
          url={url}
          index={index}
          isPrimary={index === 0}
          isDragging={draggedIndex === index}
          onRemove={() => onRemove(url)}
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
});
