import { Trash2 } from "lucide-react";

export function ProductFormActions({ onDelete }: { onDelete: () => void }) {
  return (
    <button
      type="button"
      onClick={onDelete}
      className="btn-secondary btn-sm !border-[var(--som-error)] !text-[var(--som-error)] hover:!bg-[var(--som-error-tint)]"
    >
      <Trash2 size={15} strokeWidth={1.5} aria-hidden />
      Supprimer le produit
    </button>
  );
}
