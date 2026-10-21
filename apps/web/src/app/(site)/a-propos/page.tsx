import type { Metadata } from "next";
import { AboutContent } from "@/features/brand/components/AboutContent";
import { getStoreContact } from "@/features/settings/server/queries";

export const metadata: Metadata = {
  title: "La marque | SO'MAYA - Mode & Accessoires",
  description:
    "Découvrez l'histoire de SO'MAYA, votre boutique de référence pour sublimer votre style au quotidien à Abidjan.",
};

export default async function AboutPage() {
  const contact = await getStoreContact();
  return <AboutContent whatsapp={contact.whatsapp} />;
}
