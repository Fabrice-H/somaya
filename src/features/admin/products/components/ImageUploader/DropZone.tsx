"use client";

import { memo, useCallback, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import clsx from "clsx";
import { IMAGE_CONFIG } from "@/lib/image";

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  uploading: boolean;
  progress: number;
  maxImages: number;
  currentCount: number;
}

export const DropZone = memo(function DropZone({
  onFilesSelected,
  uploading,
  progress,
  maxImages,
  currentCount,
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFilesSelected(Array.from(files));
      }
      // Reset input value to allow re-selecting same files
      e.target.value = "";
    },
    [onFilesSelected]
  );

  const remaining = maxImages - currentCount;
  if (remaining <= 0) return null;

  const acceptedFormats = IMAGE_CONFIG.acceptedExtensions.join(", ");

  return (
    <label
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={clsx(
        "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all",
        uploading
          ? "border-[#511F29]/30 bg-[#511F29]/5 cursor-wait"
          : isDragOver
            ? "border-[#511F29] bg-[#511F29]/10"
            : "border-[#511F29]/20 hover:border-[#511F29]/40 hover:bg-[#511F29]/5"
      )}
    >
      <input
        type="file"
        accept={IMAGE_CONFIG.acceptedTypes.join(",")}
        multiple
        onChange={handleChange}
        disabled={uploading}
        className="hidden"
      />

      {uploading ? (
        <div className="flex flex-col items-center">
          <Loader2 size={32} className="text-[#511F29]/50 animate-spin mb-2" />
          <span className="text-sm text-[#511F29]/60">
            {progress < 50 ? "Optimisation..." : "Upload..."} {progress}%
          </span>
          <div className="w-48 h-2 bg-[#511F29]/10 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-[#511F29] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <>
          <Upload size={32} className="text-[#511F29]/40 mb-2" />
          <span className="text-sm text-[#511F29]/60">
            Cliquez ou glissez vos images ici
          </span>
          <span className="text-xs text-[#511F29]/40 mt-1">
            {remaining} image{remaining > 1 ? "s" : ""} restante
            {remaining > 1 ? "s" : ""}
          </span>
          <span className="text-xs text-[#511F29]/30 mt-0.5">
            Formats: {acceptedFormats}
          </span>
        </>
      )}
    </label>
  );
});
