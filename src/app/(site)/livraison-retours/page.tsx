import { Metadata } from "next";
import { LegalPageLayout } from "@/features/legal/components/LegalPageLayout";
import { DeliveryReturnsContent } from "@/features/legal/components/content/DeliveryReturnsContent";

export const metadata: Metadata = {
  title: "Livraison & Retours | SO'MAYA",
  description: "Informations sur la livraison et les retours chez SO'MAYA. Livraison rapide à Abidjan.",
};

export default function LivraisonRetoursPage() {
  return (
    <LegalPageLayout title="Livraison & Retours" lastUpdated="16 Août 2026">
      <DeliveryReturnsContent />
    </LegalPageLayout>
  );
}
