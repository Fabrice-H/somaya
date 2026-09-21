export const HERO_TABS = [
  { value: "layout", label: "Disposition" },
  { value: "content", label: "Contenu" },
  { value: "media", label: "Média" },
  { value: "style", label: "Style" },
] as const;

export type HeroTab = (typeof HERO_TABS)[number]["value"];
