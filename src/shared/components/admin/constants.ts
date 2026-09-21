import { FolderOpen, Layers, LayoutDashboard, Package, Settings, ShoppingCart } from "lucide-react";

export const ADMIN_NAVIGATION = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Produits", href: "/admin/produits", icon: Package },
  { name: "Lots de Prix", href: "/admin/lots", icon: Layers },
  { name: "Categories", href: "/admin/categories", icon: FolderOpen },
  { name: "Commandes", href: "/admin/commandes", icon: ShoppingCart },
  { name: "Reglages", href: "/admin/reglages", icon: Settings },
] as const;

export const ORDER_STATUS_BADGES = {
  pending: { label: "En attente", className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmee", className: "bg-blue-100 text-blue-700" },
  preparing: { label: "En preparation", className: "bg-indigo-100 text-indigo-700" },
  shipped: { label: "Expediee", className: "bg-purple-100 text-purple-700" },
  delivered: { label: "Livree", className: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Annulee", className: "bg-red-100 text-red-700" },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS_BADGES;
