import { Metadata } from "next";
import { LegalPageLayout } from "@/features/legal/components/LegalPageLayout";
import { PrivacyPolicyContent } from "@/features/legal/components/content/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | SO'MAYA",
  description: "Découvrez comment SO'MAYA protège vos données personnelles et respecte votre vie privée.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPageLayout title="Politique de Confidentialité" lastUpdated="16 Août 2026">
      <PrivacyPolicyContent />
    </LegalPageLayout>
  );
}
