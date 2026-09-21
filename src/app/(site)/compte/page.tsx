import type { Metadata } from "next";
import { User } from "lucide-react";
import { ComingSoon } from "@/shared/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "Mon compte | SO'MAYA",
  description: "L'espace client SO'MAYA arrive bientôt.",
};

export default function ComptePage() {
  return (
    <ComingSoon
      icon={User}
      eyebrow="Espace client"
      title="Mon compte"
      text="Suivez vos commandes, retrouvez votre historique d'achats et gérez vos informations en un seul endroit."
    />
  );
}
