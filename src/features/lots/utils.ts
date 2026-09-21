import { formatPrice } from "@/shared/lib/format";
import type { CategoryOption } from "@/features/categories/types";
import type { ProductSummary } from "@/features/products/types";
import type { FlatLotItem, LotFilters, LotSortOption, LotsStats, PriceLot, PriceLotItem } from "./types";

export function createLotItem(): PriceLotItem {
  return { id: `item-${crypto.randomUUID()}`, image: "", stock: 1, label: "" };
}

export function parseNumberInput(value: string): number {
  return value === "" ? 0 : Number(value) || 0;
}

export function validateLotForm(values: { name: string; price: number; items: PriceLotItem[] }): string | null {
  if (!values.name.trim()) return "Le nom est requis";
  if (values.price <= 0) return "Le prix doit être supérieur à 0";
  if (values.items.length === 0) return "Ajoutez au moins un article";
  if (values.items.some((item) => !item.image)) return "Tous les articles doivent avoir une image";
  return null;
}

export function getLotsStats(lots: PriceLot[]): LotsStats {
  return lots.reduce<LotsStats>(
    (stats, lot) => ({
      total: stats.total + 1,
      active: stats.active + (lot.is_active ? 1 : 0),
      articles: stats.articles + lot.total_items,
      stock: stats.stock + lot.total_stock,
      outOfStock: stats.outOfStock + lot.items.filter((item) => item.stock <= 0).length,
    }),
    { total: 0, active: 0, articles: 0, stock: 0, outOfStock: 0 }
  );
}

export function getLotCategories(lots: PriceLot[]): CategoryOption[] {
  const categories = new Map(lots.flatMap((lot) => (lot.category ? [[lot.category.id, lot.category] as const] : [])));
  return [...categories.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function formatLotPrice(price: number): string {
  return formatPrice(price).replace(" FCFA", " F");
}

export const lotItemName = ({ item, lot }: FlatLotItem) => item.label || lot.name;

export function matchesLotFilters({ item, lot }: FlatLotItem, filters: LotFilters): boolean {
  if (filters.price !== null && lot.price !== filters.price) return false;
  if (filters.category && lot.category?.id !== filters.category) return false;
  if (filters.inStockOnly && item.stock <= 0) return false;
  return true;
}

export function compareLotItems(sortBy: LotSortOption) {
  return (a: FlatLotItem, b: FlatLotItem) => {
    const stockOrder = Number(a.item.stock <= 0) - Number(b.item.stock <= 0);
    if (stockOrder !== 0) return stockOrder;
    if (sortBy === "price-desc") return b.lot.price - a.lot.price;
    if (sortBy === "name") return lotItemName(a).localeCompare(lotItemName(b), "fr");
    return a.lot.price - b.lot.price;
  };
}

export function groupByPrice(items: FlatLotItem[], descending: boolean) {
  const groups = new Map<number, FlatLotItem[]>();
  for (const flat of items) groups.set(flat.lot.price, [...(groups.get(flat.lot.price) ?? []), flat]);
  return [...groups.entries()].sort(([a], [b]) => (descending ? b - a : a - b));
}

export function countBy<T>(items: T[], key: (item: T) => string | number | undefined) {
  const counts = new Map<string | number, number>();
  for (const item of items) {
    const value = key(item);
    if (value !== undefined) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

export function toLotCardProduct(flat: FlatLotItem): ProductSummary {
  const { item, lot } = flat;
  return {
    id: item.id,
    name: lotItemName(flat),
    slug: `lot-${lot.id}`,
    price: lot.price,
    oldPrice: null,
    images: [item.image],
    isNew: false,
    isBestseller: false,
    isFeatured: false,
    stock: item.stock,
    category: lot.category,
    lots: [],
  };
}
