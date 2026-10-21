import type { HeroBanner } from "@/shared/lib/db/schema";
import { HERO_FORM_DEFAULTS, HERO_LAYOUTS } from "./constants";
import type { HeroBannerData, HeroBannerInput, HeroLayout } from "./types";

export function toHeroLayout(value: string | null | undefined): HeroLayout {
  return HERO_LAYOUTS.find((layout) => layout === value) ?? "split";
}

export function toHeroBannerData(row: HeroBanner): HeroBannerData {
  return {
    id: row.id,
    layout: row.layout,
    eyebrow: row.eyebrow,
    title: row.title,
    title_highlight: row.titleHighlight,
    title_suffix: row.titleSuffix,
    description: row.description,
    button_text: row.buttonText,
    button_link: row.buttonLink,
    media_type: row.mediaType,
    media_url: row.mediaUrl,
    media_position: row.mediaPosition,
    background_color: row.backgroundColor,
    text_color: row.textColor,
    accent_color: row.accentColor,
    is_active: row.isActive,
  };
}

export function toHeroFormValues(data: HeroBannerData | null): HeroBannerInput {
  return {
    layout: data?.layout || HERO_FORM_DEFAULTS.layout,
    eyebrow: data?.eyebrow || HERO_FORM_DEFAULTS.eyebrow,
    title: data?.title || HERO_FORM_DEFAULTS.title,
    title_highlight: data?.title_highlight || HERO_FORM_DEFAULTS.title_highlight,
    title_suffix: data?.title_suffix || HERO_FORM_DEFAULTS.title_suffix,
    description: data?.description || HERO_FORM_DEFAULTS.description,
    button_text: data?.button_text || HERO_FORM_DEFAULTS.button_text,
    button_link: data?.button_link || HERO_FORM_DEFAULTS.button_link,
    media_type: data?.media_type || HERO_FORM_DEFAULTS.media_type,
    media_url: data?.media_url || HERO_FORM_DEFAULTS.media_url,
    media_position: data?.media_position || HERO_FORM_DEFAULTS.media_position,
    background_color: data?.background_color || HERO_FORM_DEFAULTS.background_color,
    text_color: data?.text_color || HERO_FORM_DEFAULTS.text_color,
    accent_color: data?.accent_color || HERO_FORM_DEFAULTS.accent_color,
    is_active: data?.is_active ?? HERO_FORM_DEFAULTS.is_active,
  };
}
