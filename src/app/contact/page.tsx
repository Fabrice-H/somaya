import { Metadata } from "next";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";
import { ContactContent } from "./ContactContent";
import { getPublicSettings } from "@/features/admin/settings/actions";

export const metadata: Metadata = {
  title: "Contact | SO'MAYA - Mode & Accessoires",
  description:
    "Contactez SO'MAYA à Abidjan. Visitez notre boutique à Angré Château ou commandez en ligne. Livraison disponible.",
};

export default async function ContactPage() {
  const settings = await getPublicSettings();

  return (
    <>
      <HeaderWrapper />
      <main style={{ paddingTop: "20px" }}>
        <ContactContent settings={settings} />
      </main>
      <Footer />
    </>
  );
}
