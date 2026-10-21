import type { Metadata } from "next";
import { LotsContent } from "@/features/lots/components/LotsContent";
import { getPriceLotsCatalog } from "@/features/lots/server/queries";

export const metadata: Metadata = {
  title: "Par Budget | SO'MAYA - Mode & Accessoires",
  description:
    "Découvrez nos articles classés par lot de prix. Choisissez votre budget et trouvez facilement les articles qui correspondent à vos envies.",
};

export default async function LotsPage() {
  const { lots, availablePrices, categories } = await getPriceLotsCatalog();
  return <LotsContent lots={lots} availablePrices={availablePrices} categories={categories} />;
}
