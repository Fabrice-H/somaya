import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories } from "@/features/categories/server/queries";
import { getAdminProduct } from "@/features/products/server/queries";
import { ProductForm } from "@/features/products/components/admin/form/ProductForm";

export const metadata: Metadata = {
  title: "Modifier le produit | Admin SO'MAYA",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getAdminProduct(id), getCategories()]);
  if (!product) notFound();
  return <ProductForm product={product} categories={categories} />;
}
