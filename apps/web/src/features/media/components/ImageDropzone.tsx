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
      className={`flex min-h-[168px] flex-col items-center justify-center border border-dashed px-6 py-8 text-center transition-colors focus-within:border-[var(--som-ink)] ${
        uploading
          ? "cursor-wait border-[var(--som-primary-300)] bg-[var(--som-primary-50)]"
          : "cursor-pointer border-[var(--som-border-strong)] bg-[var(--som-surface-alt)] hover:border-[var(--som-ink)] hover:bg-white"
      }`}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => onFiles(event.target.files)}
        disabled={uploading}
        className="sr-only"
      />
      {uploading ? (
        <>
          <Loader2 size={18} strokeWidth={1.5} className="animate-spin text-[var(--som-primary)]" aria-hidden />
          <span className="mt-3 text-[13px] text-[var(--som-ink)]">Téléchargement en cours… {progress}%</span>
          <span className="mt-4 block h-[2px] w-full max-w-[240px] bg-[var(--som-border)]">
            <span
              className="block h-full bg-[var(--som-primary)] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </span>
        </>
      ) : (
        <>
          <span className="flex h-10 w-10 items-center justify-center border border-[var(--som-border)] bg-white text-[var(--som-ink)]">
            <Upload size={16} strokeWidth={1.5} aria-hidden />
          </span>
          <span className="mt-4 text-[14px] text-[var(--som-ink)]">Cliquez ou glissez vos images ici</span>
          <span className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)]">
            {maxImages} image{maxImages > 1 ? "s" : ""} max · 15 Mo chacune
          </span>
        </>
      )}
    </label>
  );
}
