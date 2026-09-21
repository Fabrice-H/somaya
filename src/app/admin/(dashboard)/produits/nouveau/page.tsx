import type { Metadata } from "next";
import { getCategories } from "@/features/categories/server/queries";
import { ProductForm } from "@/features/products/components/admin/form/ProductForm";

export const metadata: Metadata = {
  title: "Nouveau produit | Admin SO'MAYA",
};

export default async function NewProductPage() {
  const categories = await getCategories();
  return <ProductForm categories={categories} />;
}
