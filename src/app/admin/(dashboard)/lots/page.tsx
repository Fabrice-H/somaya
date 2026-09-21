import { Metadata } from "next";
import { getPriceLots, getCategories } from "@/features/lots/server/actions";
import { LotsPageContent } from "@/features/lots/components/admin/LotsPageContent";

export const metadata: Metadata = {
  title: "Lots de Prix | Admin SO'MAYA",
  description: "Gérer les lots de prix et leurs articles",
};

export default async function AdminLotsPage() {
  const [lots, categories] = await Promise.all([
    getPriceLots(),
    getCategories(),
  ]);

  return <LotsPageContent initialLots={lots} categories={categories} />;
}
