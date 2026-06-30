import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CatalogueContent } from "./CatalogueContent";

export const metadata: Metadata = {
  title: "Catalogue | SO'MAYA - Mode & Accessoires",
  description:
    "Découvrez notre collection complète de bijoux, sacs, vêtements, montres et accessoires. Livraison à Abidjan.",
};

export default function CataloguePage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "20px" }}>
        <CatalogueContent />
      </main>
      <Footer />
    </>
  );
}
