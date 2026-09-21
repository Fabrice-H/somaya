import type { ProductLot } from "@/shared/lib/db/schema";
import type {
  AdminProductFilters,
  LotOption,
  LotOptionItem,
  Product,
  ProductInput,
  ProductStats,
  ProductSummary,
} from "./types";

export function toLotOptions(lots: ProductLot[]): LotOption[] {
  return lots.map((lot) => {
    const items = (lot.items as LotOptionItem[] | null) ?? [];
    const images = lot.images ?? [];
    return {
      id: lot.id,
      name: lot.name,
      price: Number(lot.price),
      isAvailable: lot.isAvailable,
      items:
        items.length > 0
          ? items
          : images.map((image, index) => ({
              id: `legacy-${lot.id}-${index}`,
              image,
              stock: Math.floor(lot.stock / images.length),
            })),
    };
  });
}

export function variantLabel(color: string | null, size: string | null): string | null {
  const parts = [color, size && `Taille ${size}`].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function discountPercent(price: number, oldPrice: number | null): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}

export function availableLots(product: ProductSummary) {
  return product.lots.filter((lot) => lot.isAvailable && lot.price > 0);
}

export function effectivePrice(product: ProductSummary): number {
  const prices = availableLots(product).map((lot) => lot.price);
  return prices.length > 0 ? Math.min(...prices) : product.price;
}

export function isOutOfStock(product: ProductSummary): boolean {
  if (product.lots.length > 0) return availableLots(product).length === 0;
  return product.stock !== undefined && product.stock <= 0;
}

export function isOnSale(product: ProductSummary): boolean {
  return availableLots(product).length <= 1 && !!product.oldPrice && product.oldPrice > effectivePrice(product);
}

export function sanitizeText(value: string): string {
  return value
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "");
}

export function sanitizeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

export function parseList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toNonNegativeInt(value: string): number {
  return value === "" ? 0 : parseInt(value, 10) || 0;
}

export function isLowStock(product: Pick<Product, "stock" | "low_stock_threshold">): boolean {
  return product.stock > 0 && product.stock <= product.low_stock_threshold;
}

export function filterAdminProducts(products: Product[], { query, categoryId, stock }: AdminProductFilters): Product[] {
  const search = query.toLowerCase();
  return products.filter((product) => {
    if (
      search &&
      !product.name.toLowerCase().includes(search) &&
      !product.sku?.toLowerCase().includes(search) &&
      !product.category?.name.toLowerCase().includes(search)
    ) {
      return false;
    }
    if (categoryId && product.category_id !== categoryId) return false;
    if (stock === "in_stock" && product.stock <= 0) return false;
    if (stock === "low_stock" && product.stock > product.low_stock_threshold) return false;
    if (stock === "out_of_stock" && product.stock > 0) return false;
    return true;
  });
}

export function computeProductStats(products: Product[]): ProductStats {
  return products.reduce<ProductStats>(
    (stats, product) => ({
      total: stats.total + 1,
      active: stats.active + (product.is_active ? 1 : 0),
      lowStock: stats.lowStock + (isLowStock(product) ? 1 : 0),
      outOfStock: stats.outOfStock + (product.stock <= 0 ? 1 : 0),
    }),
    { total: 0, active: 0, lowStock: 0, outOfStock: 0 }
  );
}

export function visiblePages(current: number, total: number): number[] {
  return Array.from({ length: total }, (_, i) => i + 1).filter(
    (page) => total <= 7 || page === 1 || page === total || Math.abs(page - current) <= 1
  );
}

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function toProductInput(product: Product): ProductInput {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    old_price: product.old_price,
    category_id: product.category_id,
    images: product.images,
    colors: product.colors,
    sizes: product.sizes,
    material: product.material,
    stock: product.stock,
    low_stock_threshold: product.low_stock_threshold,
    sku: product.sku,
    is_active: product.is_active,
    is_featured: product.is_featured,
    is_new: product.is_new,
    is_bestseller: product.is_bestseller,
    sort_order: product.sort_order,
  };
}

export type ProductBadge = { text: string; tone: "light" | "accent" };

export function productBadges(product: ProductSummary): ProductBadge[] {
  if (isOutOfStock(product)) return [];
  const badges: ProductBadge[] = [];
  const status = product.isNew
    ? "Nouveau"
    : product.isBestseller
      ? "Best-seller"
      : product.isFeatured
        ? "Must-have"
        : null;
  if (status) badges.push({ text: status, tone: "light" });
  const discount = isOnSale(product) ? discountPercent(effectivePrice(product), product.oldPrice) : 0;
  if (discount > 0) badges.push({ text: `−${discount} %`, tone: "accent" });
  const lowStock = product.lots.length === 0 && product.stock !== undefined && product.stock > 0 && product.stock <= 3;
  if (lowStock) badges.push({ text: `Plus que ${product.stock}`, tone: "light" });
  return badges;
}
