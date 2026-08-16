import { Metadata } from "next";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";
import { CatalogueContent } from "./CatalogueContent";
import { getCategories } from "@/lib/queries/categories";
import { getProducts } from "@/lib/queries/products";

export const metadata: Metadata = {
  title: "Catalogue | SO'MAYA - Mode & Accessoires",
  description:
    "Découvrez notre collection complète de bijoux, sacs, vêtements, montres et accessoires. Livraison à Abidjan.",
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function CataloguePage({ searchParams }: PageProps) {
  const { q: searchQuery } = await searchParams;

  const [categories, { products }] = await Promise.all([
    getCategories(),
    getProducts({ isActive: true, limit: 100 }),
  ]);

  return (
    <>
      <HeaderWrapper />
      <main>
        <CatalogueContent
          categories={categories}
          products={products}
          initialSearchQuery={searchQuery || ""}
        />
      </main>
      <Footer />
    </>
  );
}
