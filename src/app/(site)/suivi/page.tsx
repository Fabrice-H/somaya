import type { Metadata } from "next";
import { TrackingContent } from "@/features/tracking/components/TrackingContent";

export const metadata: Metadata = {
  title: "Suivi de commande | SO'MAYA",
  description: "Suivez l'avancement de votre commande SO'MAYA avec votre numéro de commande et votre téléphone.",
  robots: { index: false },
};

export default async function TrackingPage({ searchParams }: { searchParams: Promise<{ commande?: string }> }) {
  const { commande } = await searchParams;
  return <TrackingContent initialOrderNumber={typeof commande === "string" ? commande.slice(0, 50) : ""} />;
}
