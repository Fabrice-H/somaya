import { Metadata } from "next";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: "Notre Histoire | SO'MAYA - Mode & Accessoires",
  description:
    "Découvrez l'histoire de SO'MAYA, votre boutique de référence pour sublimer votre style au quotidien à Abidjan.",
};

export default function AboutPage() {
  return (
    <>
      <HeaderWrapper />
      <main style={{ paddingTop: "20px" }}>
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}
