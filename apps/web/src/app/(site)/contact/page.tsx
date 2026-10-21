import type { Metadata } from "next";
import { ContactContent } from "@/features/contact/components/ContactContent";
import { getStoreContact } from "@/features/settings/server/queries";

export const metadata: Metadata = {
  title: "Contact | SO'MAYA - Mode & Accessoires",
  description:
    "Contactez SO'MAYA à Abidjan. Visitez notre boutique à Angré Château ou commandez en ligne. Livraison disponible.",
};

export default async function ContactPage() {
  return <ContactContent contact={await getStoreContact()} />;
}
