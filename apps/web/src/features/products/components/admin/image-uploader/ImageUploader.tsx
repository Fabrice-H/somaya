"use client";

import { AlertCircle, X } from "lucide-react";
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
    <div className="flex flex-col gap-4">
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 border-l-2 border-[var(--som-error)] bg-[var(--som-error-tint)] py-1 pl-3 pr-1 text-[13px] text-[var(--som-error)]"
        >
          <AlertCircle size={16} strokeWidth={1.5} aria-hidden className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={clearError}
            aria-label="Fermer le message"
            className="flex h-10 w-10 cursor-pointer items-center justify-center hover:opacity-70"
          >
            <X size={15} strokeWidth={1.5} aria-hidden />
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

      <p className="m-0 text-[12px] font-light text-[var(--som-gray)]">
        Les photos sont automatiquement allégées pour un chargement rapide.
      </p>
    </div>
  );
}
