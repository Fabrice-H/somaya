import { notFound } from "next/navigation";
import { ProductForm } from "@/features/products/components/admin/form/ProductForm";
import { getProduct } from "@/features/products/server/actions";
import { getCategories } from "@/features/categories/server/actions";

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
