import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryContent } from "./CategoryContent";
import { collections } from "@/data/products";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const collection = collections.find((c) => c.slug === categorySlug);

  if (!collection) {
    return {
      title: "Catégorie non trouvée | SO'MAYA",
    };
  }

  return {
    title: `${collection.name} | SO'MAYA - Mode & Accessoires`,
    description: `Découvrez notre collection ${collection.name} - ${collection.subtitle}`,
  };
}

export function generateStaticParams() {
  return collections.map((collection) => ({
    category: collection.slug,
  }));
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const collection = collections.find((c) => c.slug === categorySlug);

  if (!collection) {
    notFound();
  }

  return (
    <>
      <Header />
      <main style={{ paddingTop: "20px" }}>
        <CategoryContent collection={collection} />
      </main>
      <Footer />
    </>
  );
}
