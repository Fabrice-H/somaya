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
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{uploader.error}</div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
