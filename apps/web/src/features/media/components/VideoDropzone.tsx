"use client";

import { Film, Loader2 } from "lucide-react";
import { VIDEO_CONFIG } from "../constants";
import { useVideoUploader } from "../hooks/useVideoUploader";
import { VideoPreview } from "./VideoPreview";

type VideoDropzoneProps = {
  value: string;
  onChange: (url: string) => void;
};

export function VideoDropzone({ value, onChange }: VideoDropzoneProps) {
  const { inputRef, isUploading, error, setError, upload } = useVideoUploader(onChange);

  return (
    <div>
      {value && (
        <VideoPreview
          src={value}
          className="mb-4"
          onClear={() => {
            onChange("");
            setError(null);
          }}
        />
      )}

      <div
        onDrop={(event) => {
          event.preventDefault();
          upload(event.dataTransfer.files?.[0]);
        }}
        onDragOver={(event) => event.preventDefault()}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`flex min-h-[168px] flex-col items-center justify-center border border-dashed px-6 py-8 text-center transition-colors ${
          isUploading
            ? "cursor-wait border-[var(--som-primary-300)] bg-[var(--som-primary-50)]"
            : "cursor-pointer border-[var(--som-border-strong)] bg-[var(--som-surface-alt)] hover:border-[var(--som-ink)] hover:bg-white"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={VIDEO_CONFIG.accept}
          onChange={(event) => upload(event.target.files?.[0])}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <>
            <Loader2 size={18} strokeWidth={1.5} className="animate-spin text-[var(--som-primary)]" aria-hidden />
            <p className="m-0 mt-3 text-[13px] text-[var(--som-ink)]">Téléchargement en cours…</p>
            <p className="m-0 mt-1 text-[12px] font-light text-[var(--som-gray)]">
              Cela peut prendre quelques instants.
            </p>
            <span className="mt-4 block h-[2px] w-full max-w-[240px] animate-pulse bg-[var(--som-primary)]" />
          </>
        ) : (
          <>
            <span className="flex h-10 w-10 items-center justify-center border border-[var(--som-border)] bg-white text-[var(--som-ink)]">
              <Film size={16} strokeWidth={1.5} aria-hidden />
            </span>
            <p className="m-0 mt-4 text-[14px] text-[var(--som-ink)]">
              Glissez une vidéo ici ou cliquez pour sélectionner
            </p>
            <p className="m-0 mt-1.5 text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)]">
              MP4, MOV, WebM · 100 Mo max
            </p>
          </>
        )}
      </div>

      {error && (
        <p role="alert" className="error-som m-0">
          {error}
        </p>
      )}
    </div>
  );
}
