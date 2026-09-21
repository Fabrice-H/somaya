import Image from "next/image";
import { X } from "lucide-react";
import { ImageUpload } from "@/features/media/components/ImageUpload";
import { hintClass, labelClass } from "./styles";

type LogoFieldProps = {
  value: string;
  onChange: (url: string) => void;
};

export function LogoField({ value, onChange }: LogoFieldProps) {
  return (
    <div>
      <label className={labelClass}>Logo de la boutique</label>
      <p className={hintClass} style={{ marginBottom: 12, marginTop: 0 }}>
        Uploadez une image ou laissez vide pour afficher le nom en texte
      </p>

      {value ? (
        <div className="flex items-start gap-4">
          <div
            className="relative shrink-0 flex items-center justify-center overflow-hidden bg-[#fafafa]"
            style={{ width: 200, height: 80, border: "1px solid rgba(81, 31, 41, 0.15)" }}
          >
            <Image src={value} alt="Logo" fill className="object-contain p-2" sizes="200px" />
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Retirer le logo"
              className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-red-600 text-white rounded-full"
            >
              <X size={12} />
            </button>
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#6b6b6b] mb-2">Logo actuel</p>
          </div>
        </div>
      ) : (
        <ImageUpload images={[]} onChange={(urls) => onChange(urls[0] || "")} bucket="store" maxImages={1} />
      )}
    </div>
  );
}
