"use client";

import { useState, useCallback, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { uploadToCloudinaryDirect } from "@/lib/cloudinary/direct-upload";
import { deleteImage } from "@/features/admin/storage/actions";
import { IMAGE_CONFIG } from "@/lib/image";
import type { BucketType } from "../types";

interface UseImageUploadOptions {
  bucket: BucketType;
  maxImages?: number;
  initialImages?: string[];
  onImagesChange: (images: string[]) => void;
}

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
}

// Folder mapping for Cloudinary
const FOLDER_MAP: Record<BucketType, string> = {
  products: "somaya/products",
  categories: "somaya/categories",
  store: "somaya/store",
  lots: "somaya/lots",
};

// Compress image before upload (for faster uploads)
async function compressImage(file: File): Promise<File> {
  // Skip compression for already small files
  if (file.size < 500 * 1024) {
    return file;
  }

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 2,
      maxWidthOrHeight: 2400,
      useWebWorker: true,
      initialQuality: 0.9,
      preserveExif: false,
    });

    return new File([compressed], file.name, { type: compressed.type });
  } catch (error) {
    console.warn("Compression failed, using original:", error);
    return file;
  }
}

export function useImageUpload({
  bucket,
  maxImages = IMAGE_CONFIG.maxImages,
  initialImages = [],
  onImagesChange,
}: UseImageUploadOptions) {
  const [images, setImages] = useState<string[]>(initialImages);

  // Sync with external images changes
  useEffect(() => {
    const isDifferent =
      initialImages.length !== images.length ||
      initialImages.some((img, i) => img !== images[i]);

    if (isDifferent) {
      setImages(initialImages);
    }
  }, [initialImages]); // eslint-disable-line react-hooks/exhaustive-deps

  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
  });

  const updateImages = useCallback(
    (newImages: string[]) => {
      setImages(newImages);
      onImagesChange(newImages);
    },
    [onImagesChange]
  );

  const uploadFiles = useCallback(
    async (files: File[]) => {
      // Validate count
      const remaining = maxImages - images.length;
      if (files.length > remaining) {
        setUploadState((prev) => ({
          ...prev,
          error: `Maximum ${maxImages} images. Vous pouvez encore ajouter ${remaining} image(s).`,
        }));
        return;
      }

      // Validate file types
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of files) {
        const isValidType =
          file.type.startsWith("image/") ||
          file.name.toLowerCase().endsWith(".heic") ||
          file.name.toLowerCase().endsWith(".heif");

        if (!isValidType) {
          errors.push(`${file.name}: Type non supporté`);
          continue;
        }

        if (file.size > 15 * 1024 * 1024) {
          errors.push(`${file.name}: Fichier trop volumineux (max 15MB)`);
          continue;
        }

        validFiles.push(file);
      }

      if (errors.length > 0) {
        setUploadState((prev) => ({
          ...prev,
          error: errors.join(", "),
        }));
      }

      if (validFiles.length === 0) return;

      setUploadState({ uploading: true, progress: 0, error: null });

      try {
        const folder = FOLDER_MAP[bucket];
        const uploadedUrls: string[] = [];
        const uploadErrors: string[] = [];
        const total = validFiles.length;

        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i];

          // Compress image (first 40% of progress)
          setUploadState((prev) => ({
            ...prev,
            progress: Math.round(((i + 0.3) / total) * 100),
          }));

          const compressed = await compressImage(file);

          // Upload directly to Cloudinary (remaining 60% of progress)
          setUploadState((prev) => ({
            ...prev,
            progress: Math.round(((i + 0.6) / total) * 100),
          }));

          const result = await uploadToCloudinaryDirect(compressed, folder);

          if (result.success && result.url) {
            uploadedUrls.push(result.url);
          } else {
            uploadErrors.push(result.error || "Upload failed");
          }

          setUploadState((prev) => ({
            ...prev,
            progress: Math.round(((i + 1) / total) * 100),
          }));
        }

        if (uploadErrors.length > 0) {
          setUploadState((prev) => ({
            ...prev,
            error: uploadErrors.join(", "),
            uploading: false,
          }));
        } else {
          setUploadState({ uploading: false, progress: 100, error: null });
        }

        if (uploadedUrls.length > 0) {
          updateImages([...images, ...uploadedUrls]);
        }
      } catch (error) {
        setUploadState({
          uploading: false,
          progress: 0,
          error:
            error instanceof Error ? error.message : "Erreur lors de l'upload",
        });
      }
    },
    [images, maxImages, bucket, updateImages]
  );

  const removeImage = useCallback(
    async (url: string) => {
      // Update UI immediately (optimistic update)
      const newImages = images.filter((img) => img !== url);
      updateImages(newImages);

      // Delete from Cloudinary in background
      deleteImage(url).catch((error) => {
        console.error("Failed to delete image:", error);
      });
    },
    [images, updateImages]
  );

  const reorderImages = useCallback(
    (fromIndex: number, toIndex: number) => {
      const newImages = [...images];
      const [removed] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, removed);
      updateImages(newImages);
    },
    [images, updateImages]
  );

  const clearError = useCallback(() => {
    setUploadState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    images,
    uploading: uploadState.uploading,
    progress: uploadState.progress,
    error: uploadState.error,
    uploadFiles,
    removeImage,
    reorderImages,
    clearError,
    setImages: updateImages,
  };
}
