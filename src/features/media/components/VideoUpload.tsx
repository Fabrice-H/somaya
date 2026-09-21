"use client";

import { useState } from "react";
import clsx from "clsx";
import { Link as LinkIcon, Upload } from "lucide-react";
import { VideoDropzone } from "./VideoDropzone";
import { VideoPreview } from "./VideoPreview";

type Mode = "upload" | "url";

type VideoUploadProps = {
  value: string;
  onChange: (url: string) => void;
};

const MODES: { id: Mode; label: string; icon: typeof Upload }[] = [
  { id: "upload", label: "Uploader", icon: Upload },
  { id: "url", label: "URL / Lien", icon: LinkIcon },
];

export function VideoUpload({ value, onChange }: VideoUploadProps) {
  const [mode, setMode] = useState<Mode>(value.startsWith("http") || value.startsWith("/") ? "url" : "upload");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {MODES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              mode === id ? "bg-[#511f29] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {mode === "upload" ? (
        <VideoDropzone value={value} onChange={onChange} />
      ) : (
        <div>
          <label className="block text-sm font-medium text-[#000000] mb-1.5">URL de la vidéo</label>
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
            placeholder="https://... ou /video.mp4"
          />
          <p className="text-xs text-[#4a4a4a] mt-2">URL Cloudinary, chemin local (/video.mp4), ou lien externe</p>
          {value && <VideoPreview src={value} className="mt-4" />}
        </div>
      )}
    </div>
  );
}
