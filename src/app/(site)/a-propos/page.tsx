import { Metadata } from "next";
import { AboutContent } from "@/features/brand/components/AboutContent";

export const metadata: Metadata = {
  title: "La marque | SO'MAYA - Mode & Accessoires",
  description:
    "Découvrez l'histoire de SO'MAYA, votre boutique de référence pour sublimer votre style au quotidien à Abidjan.",
};

export default function AboutPage() {
  return (
    <>
        <AboutContent />
    </>
  );
}
