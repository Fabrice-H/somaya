import clsx from "clsx";
import { Loader2, Upload } from "lucide-react";

type ImageDropzoneProps = {
  uploading: boolean;
  progress: number;
  maxImages: number;
  onFiles: (files: FileList | null) => void;
};

export function ImageDropzone({ uploading, progress, maxImages, onFiles }: ImageDropzoneProps) {
  return (
    <label
      className={clsx(
        "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
        uploading
          ? "border-[#511f29]/30 bg-[#511f29]/5"
          : "border-[#511f29]/20 hover:border-[#511f29]/40 hover:bg-[#511f29]/5"
      )}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => onFiles(event.target.files)}
        disabled={uploading}
        className="hidden"
      />
      {uploading ? (
        <>
          <Loader2 size={32} className="text-[#3c161e]/50 animate-spin mb-2" />
          <span className="text-sm text-[#3c161e]/60">Upload en cours... {progress}%</span>
        </>
      ) : (
        <>
          <Upload size={32} className="text-[#3c161e]/40 mb-2" />
          <span className="text-sm text-[#3c161e]/60">Cliquez ou glissez vos images ici</span>
          <span className="text-xs text-[#3c161e]/40 mt-1">
            Max {maxImages} image{maxImages > 1 ? "s" : ""}, 15 MB chacune
          </span>
        </>
      )}
    </label>
  );
}
