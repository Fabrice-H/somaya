import type { BadgeTone } from "@/shared/components/admin/ui/Badge";
import type { CustomerSegment, CustomerSort, SegmentRules } from "./types";

export const CUSTOMERS_CACHE_TAG = "customers";
export const CUSTOMERS_PATH = "/admin/customers";
export const CUSTOMERS_PAGE_SIZE = 20;
export const CUSTOMER_TOP_PRODUCTS_LIMIT = 5;
export const CUSTOMER_ORDERS_LIMIT = 50;

export const CUSTOMER_SEGMENTS = [
  "new",
  "active",
  "loyal",
  "vip",
  "inactive",
] as const satisfies readonly CustomerSegment[];

export const DEFAULT_SEGMENT_RULES: SegmentRules = {
  newDays: 30,
  activeDays: 90,
  loyalOrders: 3,
  vipSpent: 300_000,
  vipOrders: 6,
  inactiveDays: 120,
};

export const SEGMENT_BADGES: Record<CustomerSegment, { label: string; tone: BadgeTone; description: string }> = {
  new: { label: "Nouveau", tone: "info", description: "Première commande récente" },
  active: { label: "Actif", tone: "success", description: "A commandé récemment" },
  loyal: { label: "Fidèle", tone: "primary", description: "Plusieurs commandes" },
  vip: { label: "VIP", tone: "warning", description: "Gros volume d'achats" },
  inactive: { label: "Inactif", tone: "neutral", description: "Sans commande depuis longtemps" },
};

export const CUSTOMER_SEGMENT_FILTERS: { value: CustomerSegment | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  ...CUSTOMER_SEGMENTS.map((value) => ({ value, label: SEGMENT_BADGES[value].label })),
];

export const CUSTOMER_SORTS: { value: CustomerSort; label: string }[] = [
  { value: "recent", label: "Dernière commande" },
  { value: "spent", label: "Total dépensé" },
  { value: "orders", label: "Nombre de commandes" },
  { value: "name", label: "Nom" },
];

export const CUSTOMER_FILTER_KEYS = ["segment", "search", "sort"] as const;

export const CUSTOMER_NOTES_MAX_LENGTH = 2000;
