"use client";

import { useState } from "react";
import { IMAGE_CONFIG, UPLOAD_FOLDERS } from "../constants";
import { uploadToCloudinaryDirect } from "../direct-upload";
import { compressImage } from "../optimizer";
import { deleteImage } from "../server/actions";
import type { UploadBucket } from "../types";
import { isImageFile } from "../utils";

type Options = {
  images: string[];
  onChange: (images: string[]) => void;
  bucket: UploadBucket;
  maxImages: number;
};

export function useImageUploader({ images, onChange, bucket, maxImages }: Options) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      setError(`Maximum ${maxImages} images`);
      return;
    }

    const selected = Array.from(files).slice(0, remaining);
    if (selected.some((file) => !isImageFile(file))) {
      setError("Formats acceptés: JPG, PNG, WebP, GIF, HEIC");
      return;
    }
    if (selected.some((file) => file.size > IMAGE_CONFIG.maxFileSizeBeforeCompression)) {
      setError("Taille max: 15 MB par image");
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    const uploaded: string[] = [];
    const total = selected.length;
    try {
      for (const [index, file] of selected.entries()) {
        setProgress(Math.round(((index + 0.3) / total) * 100));
        const compressed = await compressImage(file);
        setProgress(Math.round(((index + 0.6) / total) * 100));
        const result = await uploadToCloudinaryDirect(compressed, UPLOAD_FOLDERS[bucket]);
        if (!result.success || !result.url) {
          setError(result.error || "Erreur lors de l'upload");
          break;
        }
        uploaded.push(result.url);
        setProgress(Math.round(((index + 1) / total) * 100));
      }
      if (uploaded.length) onChange([...images, ...uploaded]);
    } catch {
      setError("Erreur lors de l'upload");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const remove = (index: number) => {
    const url = images[index];
    onChange(images.filter((_, i) => i !== index));
    deleteImage(url).catch(() => undefined);
  };

  const dragOver = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const next = [...images];
    const [moved] = next.splice(draggedIndex, 1);
    next.splice(index, 0, moved);
    setDraggedIndex(index);
    onChange(next);
  };

  return {
    uploading,
    progress,
    error,
    draggedIndex,
    upload,
    remove,
    dragStart: setDraggedIndex,
    dragOver,
    dragEnd: () => setDraggedIndex(null),
  };
}
