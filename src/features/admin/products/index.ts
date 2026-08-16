// Export types
export type {
  Product,
  ProductInput,
  ProductFilters,
  ProductCategory,
  ProductFormProps,
  ProductTableProps,
  BucketType,
  UploadedImage,
  ColorValue,
  SizeValue,
} from "./types";

export { COLORS, SIZES } from "./types";

// Export schemas
export { productSchema, productUpdateSchema } from "./schemas";
export type {
  ProductSchemaInput,
  ProductSchemaOutput,
  ProductUpdateInput,
} from "./schemas";

// Export actions (server actions must be imported directly)
// export * from "./actions"; // Don't re-export server actions

// Export hooks
export * from "./hooks";

// Export store
export * from "./store";

// Export components
export { ProductForm } from "./components/ProductForm";
export { ProductTable } from "./components/ProductTable";
export { ImageUploader } from "./components/ImageUploader";
export { ProductsClient } from "./ProductsClient";
