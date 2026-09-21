import { BadgeCheck, Headset, Truck } from "lucide-react";

export const ANNOUNCEMENTS = [
  "Livraison Abidjan en 24h",
  "Expédition internationale",
  "La qualité, notre référence",
  "Paiement à la livraison & Mobile Money",
];

export const MAIN_NAV = [
  { label: "Par budget", href: "/lots" },
  { label: "La marque", href: "/a-propos" },
];

export const SHOP_SHORTCUTS = [
  { label: "Nouveautés", href: "/#nouveautes" },
  { label: "Toute la boutique", href: "/catalogue" },
];

export const MOBILE_NAV_BEFORE = [{ label: "Toute la boutique", href: "/catalogue" }];

export const MOBILE_NAV_AFTER = [
  { label: "Par budget", href: "/lots" },
  { label: "La marque", href: "/a-propos" },
  { label: "Programme fidélité", href: "/fidelite" },
  { label: "Mon compte", href: "/compte" },
  { label: "Contact", href: "/contact" },
];

export const REASSURANCES = [
  {
    icon: BadgeCheck,
    title: "Qualité sélectionnée",
    text: "Chaque pièce est choisie et contrôlée avant mise en ligne.",
  },
  { icon: Truck, title: "Livraison rapide", text: "Abidjan en 24h, reste de la Côte d'Ivoire en 48-72h." },
  { icon: Headset, title: "Conseil personnalisé", text: "Une équipe joignable par WhatsApp pour vous guider." },
];

export const LEGAL_LINKS = [
  { label: "Livraison & Retours", href: "/livraison-retours" },
  { label: "Conditions Générales de Vente", href: "/conditions-generales" },
  { label: "Politique de Confidentialité", href: "/politique-confidentialite" },
];

export const PAYMENT_METHODS = [
  { name: "Wave", logo: "/images/wave.webp", fit: "contain", bg: "#1dc4ff" },
  { name: "Orange Money", logo: "/images/orange_money.webp", fit: "contain", bg: "#000000" },
  { name: "MTN MoMo", logo: "/images/momo_money.webp", fit: "cover", bg: "#ffcb05" },
  { name: "Moov Money", logo: "/images/moov_money.webp", fit: "cover", bg: "#0066b3" },
] as const;
