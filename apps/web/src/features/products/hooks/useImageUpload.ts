"use client";

import { useState } from "react";
import { uploadToCloudinaryDirect } from "@/features/media/direct-upload";
import { deleteImage } from "@/features/media/server/actions";
import { IMAGE_CONFIG, UPLOAD_FOLDERS } from "@/features/media/constants";
import { compressImage } from "@/features/media/optimizer";
import { isImageFile } from "@/features/media/utils";
import type { UploadBucket } from "@/features/media/types";
import { moveItem } from "../utils";

interface UseImageUploadOptions {
  images: string[];
  onChange: (images: string[]) => void;
  bucket: UploadBucket;
  maxImages: number;
}

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
}

const IDLE: UploadState = { uploading: false, progress: 0, error: null };

function validateFiles(files: File[]) {
  const valid: File[] = [];
  const errors: string[] = [];
  for (const file of files) {
    if (!isImageFile(file)) errors.push(`${file.name}: Type non supporté`);
    else if (file.size > IMAGE_CONFIG.maxFileSizeBeforeCompression)
      errors.push(`${file.name}: Fichier trop volumineux (max 15MB)`);
    else valid.push(file);
  }
  return { valid, errors };
}

export function useImageUpload({ images, onChange, bucket, maxImages }: UseImageUploadOptions) {
  const [state, setState] = useState<UploadState>(IDLE);

  const setProgress = (step: number, total: number) =>
    setState((prev) => ({ ...prev, progress: Math.round((step / total) * 100) }));

  const uploadFiles = async (files: File[]) => {
    const remaining = maxImages - images.length;
    if (files.length > remaining) {
      setState((prev) => ({
        ...prev,
        error: `Maximum ${maxImages} images. Vous pouvez encore ajouter ${remaining} image(s).`,
      }));
      return;
    }

    const { valid, errors } = validateFiles(files);
    if (errors.length > 0) setState((prev) => ({ ...prev, error: errors.join(", ") }));
    if (valid.length === 0) return;

    setState({ uploading: true, progress: 0, error: null });

    try {
      const uploaded: string[] = [];
      const failures: string[] = [];

      for (const [index, file] of valid.entries()) {
        setProgress(index + 0.3, valid.length);
        const compressed = await compressImage(file);
        setProgress(index + 0.6, valid.length);
        const result = await uploadToCloudinaryDirect(compressed, UPLOAD_FOLDERS[bucket]);
        if (result.success && result.url) uploaded.push(result.url);
        else failures.push(result.error || "Upload failed");
        setProgress(index + 1, valid.length);
      }

      setState(
        failures.length > 0
          ? (prev) => ({ ...prev, uploading: false, error: failures.join(", ") })
          : { uploading: false, progress: 100, error: null }
      );
      if (uploaded.length > 0) onChange([...images, ...uploaded]);
    } catch (error) {
      setState({ ...IDLE, error: error instanceof Error ? error.message : "Erreur lors de l'upload" });
    }
  };

  const removeImage = async (url: string) => {
    onChange(images.filter((image) => image !== url));
    deleteImage(url).catch(() => undefined);
  };

  const reorderImages = (from: number, to: number) => onChange(moveItem(images, from, to));

  const clearError = () => setState((prev) => ({ ...prev, error: null }));

  return { ...state, uploadFiles, removeImage, reorderImages, clearError };
}
