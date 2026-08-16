import { ProductForm } from "@/features/admin/products";
import { getCategories } from "@/features/admin/categories/actions";

export const metadata = {
  title: "Nouveau produit | Admin SO'MAYA",
};

export default async function NewProductPage() {
  const categories = await getCategories();

  return <ProductForm categories={categories} />;
}
