import { Quote } from "lucide-react";
import { EmptyState } from "@/shared/components/admin/ui/EmptyState";

export function TestimonialsEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="border border-[var(--som-border)] bg-white">
      <EmptyState
        icon={Quote}
        title="Aucun témoignage"
        description="Mettez en avant les retours de vos clientes sur la page d'accueil."
        action={
          <button type="button" onClick={onAdd} className="btn-secondary btn-sm">
            Ajouter le premier
          </button>
        }
      />
    </div>
  );
}
