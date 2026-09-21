import type { Category as CategoryRow, PriceLot as PriceLotRow } from "@/shared/lib/db/schema";
import type { PriceLot, PriceLotItem } from "../types";

export function toLotItems(items: unknown): PriceLotItem[] {
  return (items as PriceLotItem[] | null) ?? [];
}

export function toAdminPriceLot(row: PriceLotRow & { category: CategoryRow | null }): PriceLot {
  const items = toLotItems(row.items);
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    category_id: row.categoryId,
    category: row.category ? { id: row.category.id, name: row.category.name, slug: row.category.slug } : null,
    items,
    is_active: row.isActive,
    sort_order: row.sortOrder,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
    total_items: items.length,
    total_stock: items.reduce((sum, item) => sum + item.stock, 0),
  };
}
