import { effectivePrice, isOnSale, isOutOfStock } from "@/features/products/utils";
import type { ShopProduct } from "@/features/products/types";
import { PRICE_RANGES } from "./constants";
import type { CatalogueFilters, PriceRangeKey, SortOption } from "./types";

function inRange(product: ShopProduct, key: PriceRangeKey): boolean {
  const range = PRICE_RANGES.find((r) => r.key === key)!;
  const price = effectivePrice(product);
  return price >= range.min && price <= range.max;
}

export function matchesFilters(product: ShopProduct, filters: CatalogueFilters): boolean {
  if (filters.query) {
    const haystack = `${product.name} ${product.description ?? ""} ${product.category?.name ?? ""}`.toLowerCase();
    if (!haystack.includes(filters.query)) return false;
  }
  if (filters.category && product.category?.slug !== filters.category) return false;
  if (filters.priceRange && !inRange(product, filters.priceRange)) return false;
  if (filters.inStockOnly && isOutOfStock(product)) return false;
  if (filters.onSaleOnly && !isOnSale(product)) return false;
  return true;
}

export function compareProducts(sortBy: SortOption) {
  return (a: ShopProduct, b: ShopProduct) => {
    const stockOrder = Number(isOutOfStock(a)) - Number(isOutOfStock(b));
    if (stockOrder !== 0) return stockOrder;
    switch (sortBy) {
      case "price-asc":
        return effectivePrice(a) - effectivePrice(b);
      case "price-desc":
        return effectivePrice(b) - effectivePrice(a);
      case "name":
        return a.name.localeCompare(b.name, "fr");
      default:
        return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
    }
  };
}

export function countByCategory(products: ShopProduct[]): Record<string, number> {
  return products.reduce<Record<string, number>>((counts, product) => {
    const slug = product.category?.slug;
    if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
    return counts;
  }, {});
}
