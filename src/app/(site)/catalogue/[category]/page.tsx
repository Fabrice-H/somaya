import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogueContent } from "@/features/catalog/components/CatalogueContent";
import { getActiveCategories, getCategoryBySlug } from "@/features/categories/server/queries";
import { getShopProducts } from "@/features/products/server/queries";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Catégorie introuvable | SO'MAYA" };
  return {
    title: `${category.name} | SO'MAYA - Mode & Accessoires`,
    description: category.description ?? `Découvrez notre collection ${category.name}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const [category, categories, products] = await Promise.all([
    getCategoryBySlug(slug),
    getActiveCategories(),
    getShopProducts(),
  ]);
  if (!category) notFound();

  return (
    <CatalogueContent
      categories={categories}
      products={products}
      initialCategory={category.slug}
      title={category.name}
    />
  );
}
