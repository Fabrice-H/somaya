import type { Metadata } from "next";
import { Gift } from "lucide-react";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Programme fidélité | SO'MAYA",
  description: "Le programme fidélité SO'MAYA arrive bientôt.",
};

export default function FidelitePage() {
  return (
    <ComingSoon
      icon={Gift}
      eyebrow="Programme fidélité"
      title="Le Club SO'MAYA"
      text="Cumulez des points à chaque commande et profitez d'avantages réservés à nos clientes et clients fidèles."
    />
  );
}
