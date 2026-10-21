import type { HERO_LAYOUTS, HERO_MEDIA_TYPES } from "./constants";

export type HeroLayout = (typeof HERO_LAYOUTS)[number];

export type HeroMediaType = (typeof HERO_MEDIA_TYPES)[number];

export type HeroBannerContent = {
  id: string;
  layout: string;
  eyebrow: string | null;
  title: string | null;
  title_highlight: string | null;
  title_suffix: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  media_type: string;
  media_url: string | null;
  media_position: string | null;
};

export type HeroBannerData = HeroBannerContent & {
  background_color: string | null;
  text_color: string | null;
  accent_color: string | null;
  is_active: boolean;
};

export type HeroBannerInput = Omit<HeroBannerData, "id">;

export type HeroFieldUpdater = <K extends keyof HeroBannerInput>(key: K, value: HeroBannerInput[K]) => void;

export type ActionResult = { success: boolean; error?: string };
