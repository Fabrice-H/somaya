import type { LotFilters, LotSortOption } from "./types";

export const PRICE_LOTS_CACHE_TAG = "price-lots";

export const ADMIN_LOTS_PATH = "/admin/lots";

export const PRICE_LOTS_REVALIDATE_PATHS = [ADMIN_LOTS_PATH, "/lots"] as const;

export const LOT_FORM_TABS = [
  { key: "articles", label: "Articles" },
  { key: "settings", label: "Options" },
] as const;

export const LOT_SORT_OPTIONS: { value: LotSortOption; label: string }[] = [
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "name", label: "Alphabétique" },
];

export const NO_LOT_FILTERS: LotFilters = { price: null, category: null, inStockOnly: false };
