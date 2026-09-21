import Image from "next/image";
import { X } from "lucide-react";
import { ImageUpload } from "@/features/media/components/ImageUpload";

type LogoFieldProps = {
  value: string;
  onChange: (url: string) => void;
};

export function LogoField({ value, onChange }: LogoFieldProps) {
  return (
    <div>
      <p className="label-som m-0">Logo de la boutique</p>
      <p className="help-som m-0 mb-3">Téléchargez une image, ou laissez vide pour afficher le nom en texte.</p>

      {value ? (
        <div className="relative flex h-[96px] w-full max-w-[260px] items-center justify-center border border-[var(--som-border)] bg-[var(--som-surface-alt)]">
          <Image src={value} alt="Logo actuel" fill className="object-contain p-4" sizes="260px" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Retirer le logo"
            className="absolute right-2 top-2 flex h-9 w-9 cursor-pointer items-center justify-center border border-[var(--som-border)] bg-white text-[var(--som-ink)] transition-colors hover:border-[var(--som-ink)]"
          >
            <X size={15} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      ) : (
        <ImageUpload images={[]} onChange={(urls) => onChange(urls[0] || "")} bucket="store" maxImages={1} />
      )}
    </div>
  );
}
