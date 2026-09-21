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
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  items: PriceLotItem[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Computed
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

export type PriceLotItemFormData = {
  id: string;
  image: string;
  stock: number;
  label?: string;
};

export type PublicPriceLot = {
  id: string;
  name: string;
  price: number;
  category: { id: string; name: string; slug: string } | null;
  items: PriceLotItem[];
};

export type PriceLotsCatalog = {
  lots: PublicPriceLot[];
  availablePrices: number[];
  categories: { id: string; name: string; slug: string }[];
};
