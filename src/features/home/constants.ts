export const HERO_BANNER_ID = "00000000-0000-0000-0000-000000000003";
export const HERO_CACHE_TAG = "hero-banner";

export const HOME_LIMITS = {
  categories: 5,
  newArrivals: 8,
  bestsellers: 4,
  testimonials: 6,
} as const;

export const HERO_LAYOUTS = ["split", "centered", "fullwidth"] as const;
export const HERO_MEDIA_TYPES = ["image", "video"] as const;

export const HERO_COLORS = {
  background: "#511f29",
  text: "#ffffff",
  accent: "#f1e1e5",
} as const;

export const HERO_FORM_DEFAULTS = {
  layout: "split",
  eyebrow: "Maison de mode · Abidjan",
  title: "L'élégance",
  title_highlight: "commence",
  title_suffix: "ici.",
  description: "Des pièces sélectionnées pour accompagner chaque femme et chaque homme au quotidien.",
  button_text: "Découvrir la collection",
  button_link: "#collections",
  media_type: "video",
  media_url: "",
  media_position: "center center",
  background_color: HERO_COLORS.background,
  text_color: HERO_COLORS.text,
  accent_color: HERO_COLORS.accent,
  is_active: true,
} as const;

export const HERO_DEFAULTS = {
  eyebrow: "Maison de mode · Abidjan",
  title: "L'élégance",
  titleHighlight: "commence",
  titleSuffix: "ici.",
  description: "Des pièces sélectionnées pour accompagner chaque femme et chaque homme au quotidien.",
  buttonText: "Découvrir la collection",
  buttonLink: "#collections",
  mediaType: "image",
  mediaUrl: "/images/so_maya_ci_1776781082_3880233341219782649_13316418128.jpg",
  mediaPosition: "center 22%",
} as const;
