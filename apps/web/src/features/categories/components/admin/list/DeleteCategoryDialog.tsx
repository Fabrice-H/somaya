import { Loader2 } from "lucide-react";

type DeleteCategoryDialogProps = {
  name: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteCategoryDialog({ name, loading, onCancel, onConfirm }: DeleteCategoryDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={() => !loading && onCancel()} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-category-title"
        className="relative w-full max-w-md border border-[var(--som-border)] bg-white p-6 lg:p-8"
      >
        <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-[var(--som-error)]">Suppression</p>
        <h3 id="delete-category-title" className="m-0 mt-2 text-[18px] font-medium text-[var(--som-ink)]">
          Supprimer la catégorie ?
        </h3>
        <p className="m-0 mt-3 text-[14px] font-light leading-relaxed text-[var(--som-gray)]">
          « {name} » sera supprimée. Les produits associés ne seront pas supprimés mais perdront leur catégorie.
        </p>
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={loading} className="btn-secondary btn-sm">
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="btn-primary btn-sm bg-[var(--som-error)]! hover:opacity-90"
          >
            {loading && <Loader2 size={15} strokeWidth={1.5} className="animate-spin" aria-hidden />}
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
