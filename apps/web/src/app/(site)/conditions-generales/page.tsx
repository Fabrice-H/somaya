import { Metadata } from "next";
import { LegalPageLayout } from "@/features/legal/components/LegalPageLayout";
import { TermsOfSaleContent } from "@/features/legal/components/content/TermsOfSaleContent";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente | SO'MAYA",
  description: "Consultez les conditions générales de vente de SO'MAYA pour vos achats en ligne.",
};

export default function ConditionsGeneralesPage() {
  return (
    <LegalPageLayout title="Conditions Générales de Vente" lastUpdated="16 Août 2026">
      <TermsOfSaleContent />
    </LegalPageLayout>
  );
}
