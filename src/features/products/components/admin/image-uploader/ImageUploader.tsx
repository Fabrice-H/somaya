"use client";

import { memo, useCallback } from "react";
import { DropZone } from "./DropZone";
import { ImageGrid } from "./ImageGrid";
import { useImageUpload } from "@/features/products/hooks/useImageUpload";
import { IMAGE_CONFIG } from "@/features/media/constants";
import type { BucketType } from "@/features/products/types";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  bucket: BucketType;
  maxImages?: number;
}

export const ImageUploader = memo(function ImageUploader({
  images: initialImages,
  onChange,
  bucket,
  maxImages = IMAGE_CONFIG.maxImages,
}: ImageUploaderProps) {
  const {
    images,
    uploading,
    progress,
    error,
    uploadFiles,
    removeImage,
    reorderImages,
    clearError,
    setImages,
  } = useImageUpload({
    bucket,
    maxImages,
    initialImages,
    onImagesChange: onChange,
  });

  // Sync with external images prop
  const handleFilesSelected = useCallback(
    (files: File[]) => {
      clearError();
      uploadFiles(files);
    },
    [uploadFiles, clearError]
  );

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="text-red-500 hover:text-red-700 text-xs underline"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Image grid with drag-to-reorder */}
      <ImageGrid
        images={images}
        onRemove={removeImage}
        onReorder={reorderImages}
      />

      {/* Drop zone for uploading */}
      <DropZone
        onFilesSelected={handleFilesSelected}
        uploading={uploading}
        progress={progress}
        maxImages={maxImages}
        currentCount={images.length}
      />

      {/* Help text */}
      <p className="text-xs text-[#3c161e]/40 text-center">
        Les images sont automatiquement optimisées et converties en WebP pour
        de meilleures performances.
      </p>
    </div>
  );
});
