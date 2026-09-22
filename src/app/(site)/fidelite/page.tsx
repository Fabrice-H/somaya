import type { Metadata } from "next";
import { LoyaltyProgramContent } from "@/features/loyalty/components/LoyaltyProgramContent";
import { getPublicLoyaltySettings } from "@/features/loyalty/server/settings";

export const metadata: Metadata = {
  title: "Programme fidélité | SO'MAYA",
  description:
    "Le Club SO'MAYA : cumulez des points à chaque commande livrée et profitez d'avantages réservés à nos fidèles.",
};

export default async function FidelitePage() {
  const settings = await getPublicLoyaltySettings();
  return <LoyaltyProgramContent settings={settings} />;
}
