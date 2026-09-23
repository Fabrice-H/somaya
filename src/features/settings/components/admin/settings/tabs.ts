export const SETTINGS_TABS = [
  { value: "boutique", label: "Boutique" },
  { value: "contact", label: "Contact" },
  { value: "livraison", label: "Livraison" },
  { value: "apparence", label: "Apparence" },
  { value: "hero", label: "Hero banner" },
  { value: "temoignages", label: "Témoignages" },
  { value: "automatisations", label: "Automatisations" },
] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number]["value"];

const FORM_TABS: readonly SettingsTab[] = ["boutique", "contact", "livraison", "apparence"];

export const isFormTab = (tab: SettingsTab) => FORM_TABS.includes(tab);
