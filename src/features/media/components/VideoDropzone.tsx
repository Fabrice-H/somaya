"use client";

import clsx from "clsx";
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
        className={clsx(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
          isUploading ? "border-black bg-[#511f29]/5" : "border-gray-200 hover:border-[#511f29]/50 hover:bg-[#511f29]/5"
        )}
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
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="text-[#3c161e] animate-spin" />
            <p className="text-[#3c161e] font-medium">Upload en cours...</p>
            <p className="text-xs text-gray-500">Cela peut prendre quelques instants</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#511f29]/10 flex items-center justify-center">
              <Film size={24} className="text-[#3c161e]" />
            </div>
            <div>
              <p className="font-medium text-[#000000]">Glissez une vidéo ici ou cliquez pour sélectionner</p>
              <p className="text-sm text-gray-500 mt-1">MP4, MOV, WebM · Max 100 MB</p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
