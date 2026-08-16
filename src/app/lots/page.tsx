import { Metadata } from "next";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";
import { LotsContent } from "./LotsContent";
import { getActivePriceLots } from "@/lib/queries/lots";

export const metadata: Metadata = {
  title: "Par Budget | SO'MAYA - Mode & Accessoires",
  description:
    "Découvrez nos articles classés par lot de prix. Choisissez votre budget et trouvez facilement les articles qui correspondent à vos envies.",
};

// Force dynamic rendering (no SSG) until price_lots table exists
export const dynamic = "force-dynamic";

export default async function LotsPage() {
  let lots: Awaited<ReturnType<typeof getActivePriceLots>>["lots"] = [];
  let availablePrices: number[] = [];
  let categories: Awaited<ReturnType<typeof getActivePriceLots>>["categories"] = [];

  try {
    const data = await getActivePriceLots();
    lots = data.lots;
    availablePrices = data.availablePrices;
    categories = data.categories;
  } catch (error) {
    // Table might not exist yet
    console.error("Error fetching price lots:", error);
  }

  return (
    <>
      <HeaderWrapper />
      <main>
        <LotsContent
          lots={lots}
          availablePrices={availablePrices}
          categories={categories}
        />
      </main>
      <Footer />
    </>
  );
}
