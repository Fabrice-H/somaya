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

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
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

export interface ProductInput {
  name: string;
  slug?: string;
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

export type ProductActionResult = { success: true; id?: string } | { success: false; error: string };

export interface AdminProductFilters {
  query: string;
  categoryId: string;
  stock: string;
}

export interface ProductStats {
  total: number;
  active: number;
  lowStock: number;
  outOfStock: number;
}

export interface CategoryOption {
  id: string;
  name: string;
}

export type ProductFormTab = "general" | "images" | "pricing" | "settings";
