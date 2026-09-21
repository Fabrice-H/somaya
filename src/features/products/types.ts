import type { Category } from "@/features/categories/server/actions";
import type { COLORS, SIZES } from "./constants";

export type ProductSummaryLot = {
  id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
  isAvailable: boolean;
};

export type ProductSummary = {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  stock?: number;
  createdAt?: string;
  category: { id: string; name: string; slug: string } | null;
  lots: ProductSummaryLot[];
};

export type ShopProduct = ProductSummary & { description: string | null };

export type LotOptionItem = {
  id: string;
  image: string;
  stock: number;
  label?: string;
};

export type LotOption = {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  items: LotOptionItem[];
};

export type SelectedLotItem = {
  lotId: string;
  lotName: string;
  lotPrice: number;
  itemId: string;
  itemImage: string;
  itemStock: number;
  itemLabel?: string;
};

export type ColorValue = (typeof COLORS)[number]["value"];
export type SizeValue = (typeof SIZES)[number];

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

// Individual item within a lot (each is a purchasable article)
export interface LotItemData {
  id: string;
  image: string;
  stock: number;
  label?: string;
}

export interface ProductLot {
  id: string;
  product_id: string;
  name: string;
  price: number;
  items: LotItemData[]; // NEW: array of purchasable items
  images: string[]; // DEPRECATED: kept for backward compat
  stock: number; // DEPRECATED: kept for backward compat
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  old_price: number | null;
  category_id: string | null;
  images: string[];
  colors: string[];
  sizes: string[];
  material: string | null;
  stock: number;
  low_stock_threshold: number;
  sku: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  sort_order: number;
  views_count: number;
  created_at: string;
  updated_at: string;
  category?: ProductCategory | null;
}

export interface LotItemFormData {
  id: string;
  image: string;
  stock: number;
  label?: string;
}

export interface ProductLotFormData {
  id?: string;
  name: string;
  price: number;
  items: LotItemFormData[]; // Array of purchasable items
  is_available: boolean;
  sort_order: number;
}

export interface ProductInput {
  name: string;
  slug?: string; // Auto-generated server-side if not provided
  description?: string | null;
  price: number;
  old_price?: number | null;
  category_id?: string | null;
  images: string[];
  colors: string[];
  sizes: string[];
  material?: string | null;
  stock: number;
  low_stock_threshold: number;
  sku?: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  sort_order: number;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
}

export interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export interface ProductTableProps {
  initialProducts: Product[];
}

export type BucketType = "products" | "categories" | "store" | "lots";

export interface UploadedImage {
  url: string;
  isUploading?: boolean;
  progress?: number;
}
