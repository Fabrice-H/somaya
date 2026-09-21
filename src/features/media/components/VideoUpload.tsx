"use client";

import { useId, useState } from "react";
import { Link as LinkIcon, Upload } from "lucide-react";
import { VideoDropzone } from "./VideoDropzone";
import { VideoPreview } from "./VideoPreview";

type Mode = "upload" | "url";

type VideoUploadProps = {
  value: string;
  onChange: (url: string) => void;
};

const MODES: { id: Mode; label: string; icon: typeof Upload }[] = [
  { id: "upload", label: "Télécharger", icon: Upload },
  { id: "url", label: "Lien", icon: LinkIcon },
];

export function VideoUpload({ value, onChange }: VideoUploadProps) {
  const [mode, setMode] = useState<Mode>(value.startsWith("http") || value.startsWith("/") ? "url" : "upload");
  const inputId = useId();

  return (
    <div className="space-y-4">
      <div role="group" aria-label="Source de la vidéo" className="inline-flex border border-[var(--som-border)]">
        {MODES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
            className={`flex min-h-10 cursor-pointer items-center gap-2 px-4 text-[11px] uppercase tracking-[0.16em] transition-colors ${
              mode === id
                ? "bg-[var(--som-primary-50)] text-[var(--som-primary)]"
                : "bg-white text-[var(--som-gray)] hover:text-[var(--som-ink)]"
            }`}
          >
            <Icon size={15} strokeWidth={1.5} aria-hidden />
            {label}
          </button>
        ))}
      </div>

      {mode === "upload" ? (
        <VideoDropzone value={value} onChange={onChange} />
      ) : (
        <div>
          <label htmlFor={inputId} className="label-som">
            URL de la vidéo
          </label>
          <input
            id={inputId}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="input-som"
            placeholder="https://… ou /video.mp4"
          />
          <p className="help-som m-0">URL Cloudinary, chemin local (/video.mp4) ou lien externe.</p>
          {value && <VideoPreview src={value} className="mt-4" />}
        </div>
      )}
    </div>
  );
}
