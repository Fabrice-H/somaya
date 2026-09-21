import type { CatalogueFilters, SortOption } from "./types";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Nouveautés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "name", label: "Alphabétique" },
];

export const PRICE_RANGES = [
  { key: "lt20", label: "Moins de 20 000 FCFA", min: 0, max: 19999 },
  { key: "20to50", label: "20 000 – 50 000 FCFA", min: 20000, max: 50000 },
  { key: "gt50", label: "Plus de 50 000 FCFA", min: 50001, max: Infinity },
] as const;

export const NO_FILTERS: CatalogueFilters = {
  query: "",
  category: null,
  priceRange: null,
  inStockOnly: false,
  onSaleOnly: false,
};
