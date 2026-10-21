"use client";

import { useState } from "react";
import { compressImage } from "@/features/media/optimizer";
import { uploadToCloudinaryDirect } from "@/features/media/direct-upload";
import { UPLOAD_FOLDERS } from "@/features/media/constants";
import { createLotItem } from "@/features/lots/utils";
import type { PriceLotItem } from "@/features/lots/types";

export function useLotItemsEditor(initialItems: PriceLotItem[], onError: (message: string | null) => void) {
  const [items, setItems] = useState(initialItems);
  const [uploadingIds, setUploadingIds] = useState<ReadonlySet<string>>(new Set());

  const add = () => setItems((prev) => [...prev, createLotItem()]);

  const remove = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));

  const update = (id: string, updates: Partial<PriceLotItem>) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));

  const setUploading = (id: string, uploading: boolean) =>
    setUploadingIds((prev) => {
      const next = new Set(prev);
      if (uploading) next.add(id);
      else next.delete(id);
      return next;
    });

  const upload = async (id: string, file: File) => {
    setUploading(id, true);
    onError(null);
    try {
      const optimized = await compressImage(file);
      const result = await uploadToCloudinaryDirect(optimized, UPLOAD_FOLDERS.lots);
      if (result.success && result.url) update(id, { image: result.url });
      else onError(result.error || "Erreur lors de l'upload");
    } catch {
      onError("Erreur lors de l'upload de l'image");
    } finally {
      setUploading(id, false);
    }
  };

  return { items, uploadingIds, add, remove, update, upload };
}
