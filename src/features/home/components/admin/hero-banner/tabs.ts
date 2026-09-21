import { Image as ImageIcon, Layout, Palette, Type } from "lucide-react";

export const HERO_TABS = [
  { id: "layout", label: "Disposition", icon: Layout },
  { id: "content", label: "Contenu", icon: Type },
  { id: "media", label: "Média", icon: ImageIcon },
  { id: "style", label: "Style", icon: Palette },
] as const;

export type HeroTab = (typeof HERO_TABS)[number]["id"];
