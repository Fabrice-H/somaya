import { ImageIcon, Palette, Phone, Star, Store, Truck } from "lucide-react";

export const SETTINGS_TABS = [
  { id: "boutique", label: "Boutique", icon: Store },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "livraison", label: "Livraison", icon: Truck },
  { id: "apparence", label: "Apparence", icon: Palette },
  { id: "hero", label: "Hero Banner", icon: ImageIcon },
  { id: "temoignages", label: "Témoignages", icon: Star },
] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number]["id"];

const FORM_TABS: readonly SettingsTab[] = ["boutique", "contact", "livraison", "apparence"];

export const isFormTab = (tab: SettingsTab) => FORM_TABS.includes(tab);
