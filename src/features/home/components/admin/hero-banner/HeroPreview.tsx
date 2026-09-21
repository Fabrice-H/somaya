import Image from "next/image";
import { Eye, Film } from "lucide-react";
import { HERO_COLORS } from "../../../constants";
import type { HeroBannerInput } from "../../../types";
import { panelClass } from "./styles";

type PreviewProps = {
  form: HeroBannerInput;
  colors: { background: string; text: string; accent: string };
};

function PreviewMedia({ form, videoIcon }: { form: HeroBannerInput; videoIcon?: boolean }) {
  if (form.media_type === "video") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-400/50">
        {videoIcon && <Film size={40} className="text-white/70" />}
      </div>
    );
  }
  if (!form.media_url) return null;
  return (
    <Image
      src={form.media_url}
      alt="Preview"
      fill
      unoptimized
      className="object-cover"
      style={{ objectPosition: form.media_position || "center" }}
    />
  );
}

function SplitPreview({ form, colors }: PreviewProps) {
  return (
    <div className="grid grid-cols-2 h-full">
      <div className="p-6 flex flex-col justify-center">
        <div className="text-[10px] uppercase tracking-wider mb-2 opacity-80" style={{ color: colors.accent }}>
          {form.eyebrow}
        </div>
        <h3 className="text-2xl font-serif leading-tight" style={{ color: colors.text }}>
          {form.title}
          {form.title_highlight && (
            <>
              <br />
              <em style={{ fontStyle: "italic", color: colors.accent }}>{form.title_highlight}</em>
            </>
          )}
          {form.title_suffix && (
            <>
              <br />
              {form.title_suffix}
            </>
          )}
        </h3>
        <p className="text-xs mt-3 opacity-70 line-clamp-2" style={{ color: colors.text }}>
          {form.description}
        </p>
        <div
          className="mt-4 inline-block px-4 py-2 text-[10px] font-semibold uppercase tracking-wider rounded"
          style={{ backgroundColor: colors.accent, color: colors.background }}
        >
          {form.button_text}
        </div>
      </div>
      <div className="bg-gray-300 relative">
        <PreviewMedia form={form} videoIcon />
      </div>
    </div>
  );
}

function CenteredPreview({ form, colors }: PreviewProps) {
  return (
    <div className="relative h-full">
      <PreviewMedia form={form} />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
        <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: colors.accent }}>
          {form.eyebrow}
        </div>
        <h3 className="text-3xl font-serif" style={{ color: colors.text }}>
          {form.title}
        </h3>
        <p className="text-lg font-serif italic mt-1" style={{ color: colors.accent }}>
          {form.title_highlight} {form.title_suffix}
        </p>
      </div>
    </div>
  );
}

function FullwidthPreview({ form, colors }: PreviewProps) {
  return (
    <div className="relative h-full">
      <PreviewMedia form={form} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: colors.accent }}>
          {form.eyebrow}
        </div>
        <h3 className="text-xl font-serif" style={{ color: colors.text }}>
          {form.title} <em style={{ color: colors.accent }}>{form.title_highlight}</em> {form.title_suffix}
        </h3>
      </div>
    </div>
  );
}

export function HeroPreview({ form }: { form: HeroBannerInput }) {
  const colors = {
    background: form.background_color || HERO_COLORS.background,
    text: form.text_color || HERO_COLORS.text,
    accent: form.accent_color || HERO_COLORS.accent,
  };
  const Preview =
    form.layout === "split" ? SplitPreview : form.layout === "centered" ? CenteredPreview : FullwidthPreview;

  return (
    <div className={`mt-6 ${panelClass}`}>
      <div className="flex items-center gap-2 mb-4">
        <Eye size={18} className="text-[#3c161e]" />
        <h2 className="text-lg font-semibold text-[#000000]">Aperçu</h2>
      </div>
      <div className="relative rounded-lg overflow-hidden" style={{ height: 280, backgroundColor: colors.background }}>
        <Preview form={form} colors={colors} />
      </div>
    </div>
  );
}
