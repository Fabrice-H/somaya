import { Metadata } from "next";
import { HeaderWrapper } from "@/shared/components/layout/HeaderWrapper";
import { Footer } from "@/shared/components/layout/Footer";
import { CatalogueContent } from "@/features/catalog/components/CatalogueContent";
import { getCategories } from "@/features/categories/server/queries";
import { getShopProducts } from "@/features/products/server/queries";

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

  const [categories, products] = await Promise.all([getCategories(), getShopProducts()]);

  return (
    <>
      <HeaderWrapper />
      <main>
        <CatalogueContent
          categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, imageUrl: c.imageUrl }))}
          products={products}
          initialSearchQuery={searchQuery || ""}
        />
      </main>
      <Footer />
    </>
  );
}
