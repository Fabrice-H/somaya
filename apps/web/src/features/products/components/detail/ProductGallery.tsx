"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type ProductGalleryProps = {
  images: string[];
  alt: string;
  soldOut?: boolean;
};

export function ProductGallery({ images, alt, soldOut = false }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const current = Math.min(index, images.length - 1);
  const go = (step: number) => setIndex((current + step + images.length) % images.length);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [zoomed, images.length]);

  if (images.length === 0) return <div className="aspect-[4/5] w-full bg-[var(--som-primary-50)]" />;

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label="Agrandir la photo"
        className="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-[var(--som-primary-50)]"
      >
        <Image
          src={images[current]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 640px"
          className={`object-cover ${soldOut ? "opacity-55" : ""}`}
          style={{ objectPosition: "center 20%" }}
        />
        {soldOut && (
          <span className="absolute left-4 top-4 bg-white px-2.5 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[var(--som-gray)]">
            Épuisé
          </span>
        )}
      </button>

      {images.length > 1 && (
        <ul className="m-0 mt-3 flex list-none gap-2 overflow-x-auto p-0">
          {images.map((image, i) => (
            <li key={image} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Photo ${i + 1}`}
                aria-current={i === current}
                className={`relative block h-24 w-20 cursor-pointer overflow-hidden bg-[var(--som-primary-50)] transition-shadow ${
                  i === current ? "shadow-[0_0_0_1.5px_var(--som-ink)]" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={image} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {zoomed && (
        <div role="dialog" aria-modal="true" aria-label={alt} className="fixed inset-0 z-[120] bg-white">
          <Image src={images[current]} alt={alt} fill sizes="100vw" className="object-contain" />
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Fermer"
            className="absolute right-3 top-3 flex h-11 w-11 cursor-pointer items-center justify-center bg-white text-[var(--som-ink)]"
          >
            <X size={22} strokeWidth={1.4} />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Photo précédente"
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center bg-white/90 text-[var(--som-ink)]"
              >
                <ChevronLeft size={22} strokeWidth={1.4} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Photo suivante"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center bg-white/90 text-[var(--som-ink)]"
              >
                <ChevronRight size={22} strokeWidth={1.4} />
              </button>
              <p className="absolute bottom-5 left-1/2 m-0 -translate-x-1/2 text-[12px] tracking-[0.2em] text-[var(--som-gray)] tabular-nums">
                {current + 1} / {images.length}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
