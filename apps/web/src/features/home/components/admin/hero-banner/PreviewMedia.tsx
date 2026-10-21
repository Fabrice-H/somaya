import Image from "next/image";
import { Film, Image as ImageIcon } from "lucide-react";
import type { HeroBannerInput } from "../../../types";

export function PreviewMedia({ form }: { form: HeroBannerInput }) {
  const position = form.media_position || "center";
  const isVideo = form.media_type === "video";

  if (!form.media_url) {
    const Icon = isVideo ? Film : ImageIcon;
    return (
      <div className="absolute inset-0 flex items-center justify-center text-[var(--som-primary-300)]">
        <Icon size={28} strokeWidth={1.4} aria-hidden />
      </div>
    );
  }

  if (isVideo) {
    return (
      <video
        src={form.media_url}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: position }}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return (
    <Image src={form.media_url} alt="" fill unoptimized className="object-cover" style={{ objectPosition: position }} />
  );
}
