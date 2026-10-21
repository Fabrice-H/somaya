import { Play, X } from "lucide-react";

type VideoPreviewProps = {
  src: string;
  onClear?: () => void;
  className?: string;
};

export function VideoPreview({ src, onClear, className }: VideoPreviewProps) {
  return (
    <div className={`group relative overflow-hidden border border-[var(--som-border)] bg-black ${className ?? ""}`}>
      <video src={src} className="h-48 w-full object-cover" muted playsInline />
      <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
        <Play size={36} strokeWidth={1.2} className="text-white" aria-hidden />
      </div>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Retirer la vidéo"
          className="absolute right-2 top-2 flex h-9 w-9 cursor-pointer items-center justify-center border border-[var(--som-border)] bg-white text-[var(--som-ink)] transition-colors hover:border-[var(--som-error)] hover:text-[var(--som-error)]"
        >
          <X size={15} strokeWidth={1.5} aria-hidden />
        </button>
      )}
    </div>
  );
}
