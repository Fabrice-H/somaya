import { Play, X } from "lucide-react";

type VideoPreviewProps = {
  src: string;
  onClear?: () => void;
  className?: string;
};

export function VideoPreview({ src, onClear, className }: VideoPreviewProps) {
  return (
    <div className={`relative rounded-lg overflow-hidden bg-black ${className ?? ""}`}>
      <video src={src} className="w-full h-48 object-cover" muted playsInline />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <Play size={48} className="text-white" />
      </div>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Retirer la vidéo"
          className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
