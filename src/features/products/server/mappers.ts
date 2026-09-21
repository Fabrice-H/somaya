import type { Category, Product as ProductRow, ProductWithCategoryAndLots } from "@/shared/lib/db/schema";
import type { Product, ProductSummary, ShopProduct } from "../types";

export function toProductSummary(product: ProductWithCategoryAndLots): ProductSummary {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
    images: product.images ?? [],
    isNew: product.isNew,
    isBestseller: product.isBestseller,
    isFeatured: product.isFeatured,
    stock: product.stock,
    createdAt: new Date(product.createdAt).toISOString(),
    category: product.category
      ? { id: product.category.id, name: product.category.name, slug: product.category.slug }
      : null,
    lots: (product.lots ?? []).map((lot) => ({
      id: lot.id,
      name: lot.name,
      price: Number(lot.price),
      images: lot.images ?? [],
      stock: lot.stock,
      isAvailable: lot.isAvailable,
    })),
  };
}

export function toShopProduct(product: ProductWithCategoryAndLots): ShopProduct {
  return { ...toProductSummary(product), description: product.description };
}

export function toAdminProduct(product: ProductRow & { category: Category | null }): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    old_price: product.oldPrice ? Number(product.oldPrice) : null,
    category_id: product.categoryId,
    images: product.images ?? [],
    colors: product.colors ?? [],
    sizes: product.sizes ?? [],
    material: product.material,
    stock: product.stock,
    low_stock_threshold: product.lowStockThreshold,
    sku: product.sku,
    is_active: product.isActive,
    is_featured: product.isFeatured,
    is_new: product.isNew,
    is_bestseller: product.isBestseller,
    sort_order: product.sortOrder,
    views_count: product.viewsCount,
    created_at: product.createdAt.toISOString(),
    updated_at: product.updatedAt.toISOString(),
    category: product.category
      ? { id: product.category.id, name: product.category.name, slug: product.category.slug }
      : null,
  };
}
