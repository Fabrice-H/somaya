import { Layers } from "lucide-react";
import { EmptyState } from "@/shared/components/admin/ui/EmptyState";
import { NewLotLink } from "./NewLotLink";

export function LotsEmptyState() {
  return (
    <EmptyState
      icon={Layers}
      title="Aucun lot de prix"
      description="Regroupez vos articles par budget pour la page Lots."
      action={<NewLotLink className="btn-secondary btn-sm" label="Créer un lot" />}
    />
  );
}
