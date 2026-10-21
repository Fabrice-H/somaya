import { Loader2 } from "lucide-react";

type DeleteLotModalProps = {
  name: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteLotModal({ name, isLoading, onConfirm, onCancel }: DeleteLotModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-lot-title"
        className="relative w-full max-w-md border border-[var(--som-border)] bg-white p-6 lg:p-8"
      >
        <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-[var(--som-error)]">Suppression</p>
        <h3 id="delete-lot-title" className="m-0 mt-2 text-[18px] font-medium text-[var(--som-ink)]">
          Supprimer ce lot ?
        </h3>
        <p className="m-0 mt-3 text-[14px] font-light leading-relaxed text-[var(--som-gray)]">
          Le lot « {name} » et toutes ses images seront supprimés. Cette action est irréversible.
        </p>
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={isLoading} className="btn-secondary btn-sm">
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="btn-primary btn-sm bg-[var(--som-error)]! hover:opacity-90"
          >
            {isLoading && <Loader2 size={15} strokeWidth={1.5} className="animate-spin" aria-hidden />}
            {isLoading ? "Suppression…" : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
