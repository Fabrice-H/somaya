import Image from "next/image";
import { Package } from "lucide-react";

export function ProductThumb({ src, dimmed }: { src?: string; dimmed: boolean }) {
  return (
    <span className="relative block h-[70px] w-14 shrink-0 overflow-hidden bg-[var(--som-primary-50)]">
      {src ? (
        <Image src={src} alt="" fill sizes="56px" className={`object-cover ${dimmed ? "opacity-60 grayscale" : ""}`} />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-[var(--som-primary-300)]">
          <Package size={18} strokeWidth={1.3} aria-hidden />
        </span>
      )}
    </span>
  );
}
