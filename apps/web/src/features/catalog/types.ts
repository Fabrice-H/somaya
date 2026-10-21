import type { PRICE_RANGES } from "./constants";

export type SortOption = "newest" | "price-asc" | "price-desc" | "name";

export type PriceRangeKey = (typeof PRICE_RANGES)[number]["key"];

export type CatalogueFilters = {
  query: string;
  category: string | null;
  priceRange: PriceRangeKey | null;
  inStockOnly: boolean;
  onSaleOnly: boolean;
};
