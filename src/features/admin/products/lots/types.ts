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
  items: LotItemData[];
  // DEPRECATED: kept for backward compatibility
  images: string[];
  stock: number;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface LotItemInput {
  id: string;
  image: string;
  stock: number;
  label?: string;
}

export interface ProductLotInput {
  name: string;
  price: number;
  items: LotItemInput[];
  is_available: boolean;
  sort_order: number;
}

export interface ProductLotFormData {
  id?: string;
  name: string;
  price: number;
  items: LotItemInput[];
  is_available: boolean;
  sort_order: number;
}
