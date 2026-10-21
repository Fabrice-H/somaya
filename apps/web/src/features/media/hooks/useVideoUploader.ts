"use client";

import { useRef, useState } from "react";
import { UPLOAD_FOLDERS, VIDEO_CONFIG } from "../constants";
import { uploadVideoToCloudinaryDirect } from "../direct-upload";
import type { UploadBucket } from "../types";
import { isVideoFile } from "../utils";

export function useVideoUploader(onUploaded: (url: string) => void, bucket: UploadBucket = "store") {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (!isVideoFile(file)) {
      setError("Veuillez déposer une vidéo (MP4, MOV, WebM)");
      return;
    }
    if (file.size > VIDEO_CONFIG.maxFileSize) {
      setError("Fichier trop volumineux (max 100 MB)");
      return;
    }

    setIsUploading(true);
    setError(null);
    const result = await uploadVideoToCloudinaryDirect(file, UPLOAD_FOLDERS[bucket]);
    if (result.success && result.url) onUploaded(result.url);
    else setError(result.error || "Erreur lors de l'upload");
    setIsUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return { inputRef, isUploading, error, setError, upload };
}
