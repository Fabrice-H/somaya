import type { CategoryOption } from "@/features/categories/types";

export type PriceLotItem = {
  id: string;
  image: string;
  stock: number;
  label?: string;
};

export type PriceLot = {
  id: string;
  name: string;
  price: number;
  category_id: string | null;
  category: CategoryOption | null;
  items: PriceLotItem[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  total_items: number;
  total_stock: number;
};

export type PriceLotInput = {
  name: string;
  price: number;
  category_id?: string | null;
  items: PriceLotItem[];
  is_active: boolean;
  sort_order?: number;
};

export type PriceLotActionResult = { success: boolean; error?: string; id?: string };

export type LotFormTab = "articles" | "settings";

export type LotsStats = {
  total: number;
  active: number;
  articles: number;
  stock: number;
  outOfStock: number;
};

export type PublicPriceLot = {
  id: string;
  name: string;
  price: number;
  category: CategoryOption | null;
  items: PriceLotItem[];
};

export type PriceLotsCatalog = {
  lots: PublicPriceLot[];
  availablePrices: number[];
  categories: CategoryOption[];
};

export type FlatLotItem = { item: PriceLotItem; lot: PublicPriceLot };

export type LotSortOption = "price-asc" | "price-desc" | "name";

export type LotFilters = { price: number | null; category: string | null; inStockOnly: boolean };
