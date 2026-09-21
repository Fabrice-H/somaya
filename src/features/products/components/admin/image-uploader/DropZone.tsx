"use client";

import { useState, type ChangeEvent, type DragEvent } from "react";
import { Upload, Loader2 } from "lucide-react";
import clsx from "clsx";
import { IMAGE_CONFIG } from "@/features/media/constants";

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  uploading: boolean;
  progress: number;
  remaining: number;
}

const ACCEPTED_TYPES = IMAGE_CONFIG.acceptedTypes.join(",");
const ACCEPTED_FORMATS = IMAGE_CONFIG.acceptedExtensions.join(", ");

export function DropZone({ onFilesSelected, uploading, progress, remaining }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  if (remaining <= 0) return null;

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
    if (files.length > 0) onFilesSelected(files);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) onFilesSelected(Array.from(files));
    e.target.value = "";
  };

  const plural = remaining > 1 ? "s" : "";

  return (
    <label
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={clsx(
        "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all",
        uploading
          ? "border-[#511f29]/30 bg-[#511f29]/5 cursor-wait"
          : isDragOver
            ? "border-[#511f29] bg-[#511f29]/10"
            : "border-[#511f29]/20 hover:border-[#511f29]/40 hover:bg-[#511f29]/5"
      )}
    >
      <input
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        onChange={handleChange}
        disabled={uploading}
        className="hidden"
      />

      {uploading ? (
        <div className="flex flex-col items-center">
          <Loader2 size={32} className="text-[#3c161e]/50 animate-spin mb-2" />
          <span className="text-sm text-[#3c161e]/60">
            {progress < 50 ? "Optimisation..." : "Upload..."} {progress}%
          </span>
          <div className="w-48 h-2 bg-[#511f29]/10 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-[#511f29] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        <>
          <Upload size={32} className="text-[#3c161e]/40 mb-2" />
          <span className="text-sm text-[#3c161e]/60">Cliquez ou glissez vos images ici</span>
          <span className="text-xs text-[#3c161e]/40 mt-1">
            {remaining} image{plural} restante{plural}
          </span>
          <span className="text-xs text-[#3c161e]/30 mt-0.5">Formats: {ACCEPTED_FORMATS}</span>
        </>
      )}
    </label>
  );
}
