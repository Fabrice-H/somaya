import { ShoppingBag } from "lucide-react";
import { EmptyState } from "@/shared/components/admin/ui/EmptyState";

export function OrdersEmptyState({ filtered }: { filtered: boolean }) {
  return (
    <EmptyState
      icon={ShoppingBag}
      title="Aucune commande trouvée"
      description={
        filtered ? "Essayez de modifier ou de réinitialiser vos filtres." : "Les nouvelles commandes apparaîtront ici."
      }
    />
  );
}
