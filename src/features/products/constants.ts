import type { ProductInput } from "./types";

export const PRODUCTS_CACHE_TAG = "products";

export const ADMIN_PRODUCTS_PATH = "/admin/produits";

export const ADMIN_PRODUCTS_PER_PAGE = 12;

export const PRODUCT_MAX_IMAGES = 5;

export const STOCK_FILTER_OPTIONS = [
  { value: "in_stock", label: "En stock" },
  { value: "low_stock", label: "Stock faible" },
  { value: "out_of_stock", label: "Épuisé" },
] as const;

export const DEFAULT_PRODUCT_INPUT: ProductInput = {
  name: "",
  slug: "",
  description: null,
  price: 0,
  old_price: null,
  category_id: null,
  images: [],
  colors: [],
  sizes: [],
  material: null,
  stock: 0,
  low_stock_threshold: 5,
  sku: null,
  is_active: true,
  is_featured: false,
  is_new: false,
  is_bestseller: false,
  sort_order: 0,
};

export const COLORS = [
  { value: "orange", label: "Orange" },
  { value: "rouge", label: "Rouge" },
  { value: "violet", label: "Violet" },
  { value: "bleu", label: "Bleu" },
  { value: "noir", label: "Noir" },
  { value: "blanc", label: "Blanc" },
  { value: "creme", label: "Crème" },
  { value: "camel", label: "Camel" },
  { value: "vert", label: "Vert" },
  { value: "or", label: "Or" },
  { value: "gris", label: "Gris" },
] as const;

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Unique"] as const;
