"use client";

import { useState, useCallback, useEffect } from "react";
import {
  optimizeImages,
  validateImageFile,
  validateImageCount,
  IMAGE_CONFIG,
} from "@/lib/image";
import {
  uploadImage,
  deleteImage,
} from "@/features/admin/storage/actions";
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

export function useImageUpload({
  bucket,
  maxImages = IMAGE_CONFIG.maxImages,
  initialImages = [],
  onImagesChange,
}: UseImageUploadOptions) {
  const [images, setImages] = useState<string[]>(initialImages);

  // Sync with external images changes (only when initialImages actually changes)
  useEffect(() => {
    // Compare arrays by content to avoid unnecessary re-syncs
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
      const countValidation = validateImageCount(
        images.length,
        files.length,
        maxImages
      );
      if (!countValidation.valid) {
        setUploadState((prev) => ({
          ...prev,
          error: countValidation.error ?? null,
        }));
        return;
      }

      // Validate each file
      const validationErrors: string[] = [];
      const validFiles: File[] = [];

      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          validationErrors.push(`${file.name}: ${validation.error}`);
        } else {
          validFiles.push(file);
        }
      }

      if (validationErrors.length > 0) {
        setUploadState((prev) => ({
          ...prev,
          error: validationErrors.join(", "),
        }));
        return;
      }

      if (validFiles.length === 0) return;

      setUploadState({ uploading: true, progress: 0, error: null });

      try {
        // Optimize images
        const optimized = await optimizeImages(validFiles, (completed, total) => {
          setUploadState((prev) => ({
            ...prev,
            progress: Math.round((completed / total) * 50), // First 50% is optimization
          }));
        });

        // Upload optimized images
        const uploadedUrls: string[] = [];
        const uploadErrors: string[] = [];

        for (let i = 0; i < optimized.length; i++) {
          const { file } = optimized[i];

          const formData = new FormData();
          formData.set("file", file);
          formData.set("bucket", bucket);

          const result = await uploadImage(formData);

          if (result.url) {
            uploadedUrls.push(result.url);
          } else if (result.error) {
            uploadErrors.push(result.error);
          }

          setUploadState((prev) => ({
            ...prev,
            progress: 50 + Math.round(((i + 1) / optimized.length) * 50),
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
      // Delete from Cloudinary
      await deleteImage(url);

      // Update local state
      const newImages = images.filter((img) => img !== url);
      updateImages(newImages);
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
