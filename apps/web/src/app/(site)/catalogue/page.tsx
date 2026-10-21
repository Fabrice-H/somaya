import type { Metadata } from "next";
import { CatalogueContent } from "@/features/catalog/components/CatalogueContent";
import { getActiveCategories } from "@/features/categories/server/queries";
import { getShopProducts } from "@/features/products/server/queries";

export const metadata: Metadata = {
  title: "Catalogue | SO'MAYA - Mode & Accessoires",
  description:
    "Découvrez notre collection complète de bijoux, sacs, vêtements, montres et accessoires. Livraison à Abidjan.",
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function CataloguePage({ searchParams }: Props) {
  const [{ q }, categories, products] = await Promise.all([searchParams, getActiveCategories(), getShopProducts()]);

  return <CatalogueContent categories={categories} products={products} initialSearchQuery={q ?? ""} />;
}
