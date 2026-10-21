"use client";

import { IMAGE_CONFIG } from "../constants";
import { useImageUploader } from "../hooks/useImageUploader";
import type { UploadBucket } from "../types";
import { ImageDropzone } from "./ImageDropzone";
import { ImageTile } from "./ImageTile";

type ImageUploadProps = {
  images: string[];
  onChange: (images: string[]) => void;
  bucket: UploadBucket;
  maxImages?: number;
};

export function ImageUpload({ images, onChange, bucket, maxImages = IMAGE_CONFIG.maxImages }: ImageUploadProps) {
  const uploader = useImageUploader({ images, onChange, bucket, maxImages });

  return (
    <div className="space-y-4">
      {uploader.error && (
        <p role="alert" className="m-0 bg-[var(--som-error-tint)] px-4 py-3 text-[13px] text-[var(--som-error)]">
          {uploader.error}
        </p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, index) => (
            <ImageTile
              key={url}
              url={url}
              index={index}
              dragging={uploader.draggedIndex === index}
              onDragStart={() => uploader.dragStart(index)}
              onDragOver={() => uploader.dragOver(index)}
              onDragEnd={uploader.dragEnd}
              onRemove={() => uploader.remove(index)}
            />
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <ImageDropzone
          uploading={uploader.uploading}
          progress={uploader.progress}
          maxImages={maxImages}
          onFiles={uploader.upload}
        />
      )}
    </div>
  );
}
