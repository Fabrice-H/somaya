import { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";
import { CategoryContent } from "./CategoryContent";
import { getCategoryBySlug, getCategories } from "@/lib/queries/categories";
import { getProducts } from "@/lib/queries/products";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Catégorie non trouvée | SO'MAYA",
    };
  }

  return {
    title: `${category.name} | SO'MAYA - Mode & Accessoires`,
    description: category.description || `Découvrez notre collection ${category.name}`,
  };
}

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((category) => ({
      category: category.slug,
    }));
  } catch (error) {
    console.warn("generateStaticParams: Database not available, skipping pre-render", error);
    return [];
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  // Fetch products for this category
  const { products } = await getProducts({
    categorySlug: category.slug,
    isActive: true,
    limit: 100,
  });

  return (
    <>
      <HeaderWrapper />
      <main style={{ paddingTop: "20px" }}>
        <CategoryContent category={category} products={products} />
      </main>
      <Footer />
    </>
  );
}
