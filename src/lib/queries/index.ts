// Query keys
export { queryKeys, type QueryKeys } from "./keys";

// Products
export {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getBestsellerProducts,
  getNewProducts,
  getRelatedProducts,
  incrementProductViews,
  type ProductFilters,
  type PaginatedProducts,
} from "./products";

// Categories
export {
  getCategories,
  getCategoriesWithProductCount,
  getCategoryById,
  getCategoryBySlug,
  type CategoryWithProductCount,
} from "./categories";
