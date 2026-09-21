import { FolderOpen, Layers, LayoutDashboard, Package, Settings, ShoppingBag } from "lucide-react";
import type { BadgeTone } from "./ui/Badge";

export const ADMIN_NAVIGATION = [
  { label: "Vue d'ensemble", items: [{ name: "Tableau de bord", href: "/admin", icon: LayoutDashboard }] },
  {
    label: "Catalogue",
    items: [
      { name: "Produits", href: "/admin/produits", icon: Package },
      { name: "Lots de prix", href: "/admin/lots", icon: Layers },
      { name: "Catégories", href: "/admin/categories", icon: FolderOpen },
    ],
  },
  { label: "Ventes", items: [{ name: "Commandes", href: "/admin/commandes", icon: ShoppingBag }] },
  {
    label: "Configuration",
    items: [{ name: "Réglages", href: "/admin/reglages", icon: Settings }],
  },
] as const;

export const ORDER_STATUS_BADGES = {
  pending: { label: "En attente", tone: "warning" },
  confirmed: { label: "Confirmée", tone: "info" },
  preparing: { label: "En préparation", tone: "primary" },
  shipped: { label: "Expédiée", tone: "info" },
  delivered: { label: "Livrée", tone: "success" },
  cancelled: { label: "Annulée", tone: "danger" },
} as const satisfies Record<string, { label: string; tone: BadgeTone }>;

export type OrderStatus = keyof typeof ORDER_STATUS_BADGES;
