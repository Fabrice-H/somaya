import { notFound } from "next/navigation";
import { ProductForm } from "@/features/admin/products";
import { getProduct } from "@/features/admin/products/actions";
import { getCategories } from "@/features/admin/categories/actions";

export const metadata = {
  title: "Modifier le produit | Admin SO'MAYA",
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProduct(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductForm product={product} categories={categories} />;
}
