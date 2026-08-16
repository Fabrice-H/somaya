"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, GripVertical } from "lucide-react";
import { uploadImage, deleteImage } from "../storage/actions";
import clsx from "clsx";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  bucket: "products" | "categories" | "store" | "featured";
  maxImages?: number;
}

export function ImageUpload({
  images,
  onChange,
  bucket,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        setError(`Maximum ${maxImages} images`);
        return;
      }

      const filesToUpload = Array.from(files).slice(0, remaining);

      // Validate files
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"];
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"];

      for (const file of filesToUpload) {
        const fileName = file.name.toLowerCase();
        const hasValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext));
        const hasValidType = allowedTypes.includes(file.type) || file.type.startsWith("image/");

        if (!hasValidType && !hasValidExtension) {
          setError("Formats acceptés: JPG, PNG, WebP, GIF, HEIC");
          return;
        }
        if (file.size > 15 * 1024 * 1024) {
          setError("Taille max: 15 MB par image");
          return;
        }
      }

      setUploading(true);
      setError(null);

      try {
        const newUrls: string[] = [];

        for (const file of filesToUpload) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("bucket", bucket);

          const result = await uploadImage(formData);

          if (result.error) {
            setError(result.error);
            break;
          }

          if (result.url) {
            newUrls.push(result.url);
          }
        }

        if (newUrls.length > 0) {
          onChange([...images, ...newUrls]);
        }
      } catch {
        setError("Erreur lors de l'upload");
      } finally {
        setUploading(false);
      }
    },
    [images, onChange, bucket, maxImages]
  );

  const handleRemove = useCallback(
    async (index: number) => {
      const url = images[index];

      // Extract path from URL for deletion
      const urlParts = url.split("/storage/v1/object/public/");
      if (urlParts.length > 1) {
        const path = urlParts[1];
        await deleteImage(path);
      }

      onChange(images.filter((_, i) => i !== index));
    },
    [images, onChange]
  );

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    onChange(newImages);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div
              key={url}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={clsx(
                "relative group aspect-square rounded-lg overflow-hidden border-2",
                draggedIndex === index
                  ? "border-[#511F29] opacity-50"
                  : "border-transparent"
              )}
            >
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <div className="cursor-move p-2 bg-white/90 rounded-lg text-[#511F29]">
                  <GripVertical size={18} />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600"
                >
                  <X size={18} />
                </button>
              </div>
              {index === 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#511F29] text-white text-xs rounded">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {images.length < maxImages && (
        <label
          className={clsx(
            "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
            uploading
              ? "border-[#511F29]/30 bg-[#511F29]/5"
              : "border-[#511F29]/20 hover:border-[#511F29]/40 hover:bg-[#511F29]/5"
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <>
              <Loader2 size={32} className="text-[#511F29]/50 animate-spin mb-2" />
              <span className="text-sm text-[#511F29]/60">Upload en cours...</span>
            </>
          ) : (
            <>
              <Upload size={32} className="text-[#511F29]/40 mb-2" />
              <span className="text-sm text-[#511F29]/60">
                Cliquez ou glissez vos images ici
              </span>
              <span className="text-xs text-[#511F29]/40 mt-1">
                Max {maxImages} image{maxImages > 1 ? "s" : ""}, 15 MB chacune
              </span>
            </>
          )}
        </label>
      )}
    </div>
  );
}
