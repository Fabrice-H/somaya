import Link from "next/link";
import { HERO_DEFAULTS } from "../constants";
import type { HeroBannerContent } from "../types";
import { HeroMedia } from "./HeroMedia";

export function HeroSection({ data }: { data: HeroBannerContent | null }) {
  const hero = {
    eyebrow: data?.eyebrow || HERO_DEFAULTS.eyebrow,
    title: data?.title || HERO_DEFAULTS.title,
    titleHighlight: data?.title_highlight || HERO_DEFAULTS.titleHighlight,
    titleSuffix: data?.title_suffix || HERO_DEFAULTS.titleSuffix,
    description: data?.description || HERO_DEFAULTS.description,
    buttonText: data?.button_text || HERO_DEFAULTS.buttonText,
    buttonLink: data?.button_link || HERO_DEFAULTS.buttonLink,
    mediaType: data?.media_type || HERO_DEFAULTS.mediaType,
    mediaUrl: data?.media_url || HERO_DEFAULTS.mediaUrl,
    mediaPosition: data?.media_position || HERO_DEFAULTS.mediaPosition,
  };
  const media = { type: hero.mediaType, url: hero.mediaUrl, position: hero.mediaPosition };

  return (
    <>
      <section className="hidden h-[88vh] max-h-[880px] min-h-[600px] grid-cols-[1.05fr_1fr] md:grid">
        <div className="flex items-center bg-[var(--som-primary-50)] px-[clamp(40px,6vw,96px)] py-16">
          <div className="max-w-[520px]">
            <p className="m-0 mb-6 inline-block border-b border-[var(--som-primary-200)] pb-2 text-[11.5px] uppercase tracking-[0.3em] text-[var(--som-primary)]">
              {hero.eyebrow}
            </p>
            <h1 className="m-0 text-[clamp(40px,4.6vw,76px)] font-medium leading-[1.04] tracking-[-0.01em] text-[var(--som-ink)]">
              {hero.title}
              <br />
              <em className="font-light italic text-[var(--som-accent)]">{hero.titleHighlight}</em> {hero.titleSuffix}
            </h1>
            <p className="mb-10 mt-7 text-[17px] font-light leading-[1.65] text-[#4a4a4a]">{hero.description}</p>
            <Link href={hero.buttonLink} className="btn-primary">
              {hero.buttonText}
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden bg-[var(--som-primary-100)]">
          <HeroMedia {...media} priority />
        </div>
      </section>

      <section className="relative h-[85vh] max-h-[700px] min-h-[500px] overflow-hidden md:hidden">
        <HeroMedia {...media} priority />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.1)_40%,rgba(0,0,0,0.6)_100%)]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <p className="m-0 mb-5 text-[11px] uppercase tracking-[0.35em] text-white/85">{hero.eyebrow}</p>
          <h1 className="m-0 text-[clamp(42px,12vw,72px)] font-normal leading-none tracking-[0.04em] text-white">
            {hero.title}
          </h1>
          <p className="m-0 mt-2 text-[clamp(20px,5vw,28px)] font-light italic text-white/90">
            {hero.titleHighlight} {hero.titleSuffix}
          </p>
          <Link href={hero.buttonLink} className="btn-secondary-light mt-10">
            {hero.buttonText}
          </Link>
        </div>
      </section>
    </>
  );
}
