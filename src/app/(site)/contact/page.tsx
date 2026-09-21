import { Metadata } from "next";
import { ContactContent } from "@/features/contact/components/ContactContent";
import { getPublicSettings } from "@/features/settings/server/actions";

export const metadata: Metadata = {
  title: "Contact | SO'MAYA - Mode & Accessoires",
  description:
    "Contactez SO'MAYA à Abidjan. Visitez notre boutique à Angré Château ou commandez en ligne. Livraison disponible.",
};

export default async function ContactPage() {
  const settings = await getPublicSettings();

  return (
    <>
        <ContactContent settings={settings} />
    </>
  );
}
