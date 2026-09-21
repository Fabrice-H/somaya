import type { ProductWithCategoryAndLots } from "@/shared/lib/db/schema";
import type { ProductSummary, ShopProduct } from "../types";

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
