"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type HeroMediaProps = {
  type: string;
  url: string;
  position: string;
  priority?: boolean;
};

export function HeroMedia({ type, url, position, priority = false }: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (type !== "video") return;
    const play = () => videoRef.current?.play().catch(() => undefined);
    play();
    document.addEventListener("touchstart", play, { once: true });
    document.addEventListener("click", play, { once: true });
    return () => {
      document.removeEventListener("touchstart", play);
      document.removeEventListener("click", play);
    };
  }, [type]);

  if (type === "video") {
    return (
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: position }}
      >
        <source src={url} type="video/mp4" />
      </video>
    );
  }

  return (
    <Image
      src={url}
      alt="SO'MAYA"
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-cover"
      style={{ objectPosition: position }}
    />
  );
}
