import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactContent } from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact | SO'MAYA - Mode & Accessoires",
  description:
    "Contactez SO'MAYA à Abidjan. Visitez notre boutique à Angré Château ou commandez en ligne. Livraison disponible.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "20px" }}>
        <ContactContent />
      </main>
      <Footer />
    </>
  );
}
