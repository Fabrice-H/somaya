import { HERO_DEFAULTS, HERO_OVERLAYS } from "../../../constants";
import { toHeroLayout } from "../../../utils";
import type { HeroBannerInput } from "../../../types";
import { PreviewMedia } from "./PreviewMedia";

function heroText(form: HeroBannerInput) {
  return {
    eyebrow: form.eyebrow || HERO_DEFAULTS.eyebrow,
    title: form.title || HERO_DEFAULTS.title,
    highlight: form.title_highlight || HERO_DEFAULTS.titleHighlight,
    suffix: form.title_suffix || HERO_DEFAULTS.titleSuffix,
    description: form.description || HERO_DEFAULTS.description,
    button: form.button_text || HERO_DEFAULTS.buttonText,
  };
}

export function DesktopFrame({ form }: { form: HeroBannerInput }) {
  const text = heroText(form);
  const layout = toHeroLayout(form.layout);

  if (layout !== "split") {
    return (
      <div className="relative aspect-[16/10] overflow-hidden border border-[var(--som-border)] bg-[var(--som-primary-100)]">
        <PreviewMedia form={form} />
        <div aria-hidden className={`absolute inset-0 ${HERO_OVERLAYS[layout]}`} />
        <div
          className={`absolute inset-0 flex px-6 text-white ${
            layout === "centered" ? "items-center justify-center text-center" : "items-end pb-6"
          }`}
        >
          <div className="min-w-0 max-w-[80%]">
            <p className="m-0 mb-3 text-[7px] uppercase tracking-[0.3em] text-white/85">{text.eyebrow}</p>
            <p className="m-0 text-[22px] font-medium leading-[1.04] tracking-[-0.01em]">
              {text.title} <em className="font-light italic">{text.highlight}</em> {text.suffix}
            </p>
            <p className="m-0 mt-3 line-clamp-2 text-[9px] font-light leading-[1.6] text-white/85">
              {text.description}
            </p>
            <span className="mt-4 inline-flex min-h-6 items-center border border-white/70 px-3 text-[7px] font-medium uppercase tracking-[0.16em]">
              {text.button}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid aspect-[16/10] grid-cols-[1.05fr_1fr] overflow-hidden border border-[var(--som-border)]">
      <div className="flex items-center bg-[var(--som-primary-50)] px-5 py-6">
        <div className="min-w-0">
          <p className="m-0 mb-3 inline-block border-b border-[var(--som-primary-200)] pb-1 text-[7px] uppercase tracking-[0.3em] text-[var(--som-primary)]">
            {text.eyebrow}
          </p>
          <p className="m-0 text-[22px] font-medium leading-[1.04] tracking-[-0.01em] text-[var(--som-ink)]">
            {text.title}
            <br />
            <em className="font-light italic text-[var(--som-accent)]">{text.highlight}</em> {text.suffix}
          </p>
          <p className="m-0 mt-3 line-clamp-3 text-[9px] font-light leading-[1.6] text-[#4a4a4a]">{text.description}</p>
          <span className="mt-4 inline-flex min-h-6 items-center bg-[var(--som-primary)] px-3 text-[7px] font-medium uppercase tracking-[0.16em] text-white">
            {text.button}
          </span>
        </div>
      </div>
      <div className="relative bg-[var(--som-primary-100)]">
        <PreviewMedia form={form} />
      </div>
    </div>
  );
}

export function MobileFrame({ form }: { form: HeroBannerInput }) {
  const text = heroText(form);
  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[220px] overflow-hidden border border-[var(--som-border)] bg-[var(--som-primary-100)]">
      <PreviewMedia form={form} />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.1)_40%,rgba(0,0,0,0.6)_100%)]"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
        <p className="m-0 mb-3 text-[7px] uppercase tracking-[0.35em] text-white/85">{text.eyebrow}</p>
        <p className="m-0 text-[28px] leading-none tracking-[0.04em]">{text.title}</p>
        <p className="m-0 mt-1.5 text-[13px] font-light italic text-white/90">
          {text.highlight} {text.suffix}
        </p>
        <span className="mt-6 inline-flex min-h-6 items-center border border-white/70 px-3 text-[7px] font-medium uppercase tracking-[0.16em]">
          {text.button}
        </span>
      </div>
    </div>
  );
}
