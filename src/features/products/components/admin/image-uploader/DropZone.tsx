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
        "flex cursor-pointer flex-col items-center justify-center border border-dashed px-6 py-10 text-center transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--som-primary)]",
        uploading
          ? "cursor-wait border-[var(--som-primary-200)] bg-[var(--som-primary-50)]"
          : isDragOver
            ? "border-[var(--som-primary)] bg-[var(--som-primary-50)]"
            : "border-[var(--som-border-strong)] bg-[var(--som-surface-alt)] hover:border-[var(--som-primary)] hover:bg-[var(--som-primary-50)]"
      )}
    >
      <input
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        onChange={handleChange}
        disabled={uploading}
        className="sr-only"
      />

      {uploading ? (
        <div className="flex w-full max-w-[240px] flex-col items-center" role="status">
          <Loader2 size={22} strokeWidth={1.5} className="mb-3 animate-spin text-[var(--som-primary)]" aria-hidden />
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--som-ink)]">
            {progress < 50 ? "Préparation…" : "Envoi…"} <span className="tabular-nums">{progress}%</span>
          </span>
          <div className="mt-3 h-[2px] w-full overflow-hidden bg-[var(--som-primary-100)]">
            <div
              className="h-full bg-[var(--som-primary)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <>
          <span className="flex h-11 w-11 items-center justify-center bg-white text-[var(--som-primary)]">
            <Upload size={18} strokeWidth={1.5} aria-hidden />
          </span>
          <span className="mt-4 text-[14px] text-[var(--som-ink)]">Ajouter des photos</span>
          <span className="mt-1 text-[13px] font-light text-[var(--som-gray)]">
            Cliquez ou glissez vos images ici · {remaining} restante{plural}
          </span>
          <span className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--som-gray)]">
            {ACCEPTED_FORMATS}
          </span>
        </>
      )}
    </label>
  );
}
