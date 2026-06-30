import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
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
      <Header />
      <main style={{ paddingTop: "20px" }}>
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}
