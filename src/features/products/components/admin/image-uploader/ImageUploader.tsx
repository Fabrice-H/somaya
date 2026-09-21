"use client";

import type { UploadBucket } from "@/features/media/types";
import { useImageUpload } from "@/features/products/hooks/useImageUpload";
import { DropZone } from "./DropZone";
import { ImageGrid } from "./ImageGrid";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  bucket: UploadBucket;
  maxImages: number;
}

export function ImageUploader({ images, onChange, bucket, maxImages }: ImageUploaderProps) {
  const { uploading, progress, error, uploadFiles, removeImage, reorderImages, clearError } = useImageUpload({
    images,
    onChange,
    bucket,
    maxImages,
  });

  const handleFilesSelected = (files: File[]) => {
    clearError();
    uploadFiles(files);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={clearError} className="text-red-500 hover:text-red-700 text-xs underline">
            Fermer
          </button>
        </div>
      )}

      <ImageGrid images={images} onRemove={removeImage} onReorder={reorderImages} />

      <DropZone
        onFilesSelected={handleFilesSelected}
        uploading={uploading}
        progress={progress}
        remaining={maxImages - images.length}
      />

      <p className="text-xs text-[#3c161e]/40 text-center">
        Les images sont automatiquement optimisées et converties en WebP pour de meilleures performances.
      </p>
    </div>
  );
}
