import { Loader2 } from "lucide-react";

type DeleteLotDialogProps = {
  name: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteLotDialog({ name, isDeleting, onCancel, onConfirm }: DeleteLotDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-lot-form-title"
        className="w-full max-w-md border border-[var(--som-border)] bg-white p-6 lg:p-8"
      >
        <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-[var(--som-error)]">Suppression</p>
        <h3 id="delete-lot-form-title" className="m-0 mt-2 text-[18px] font-medium text-[var(--som-ink)]">
          Supprimer le lot
        </h3>
        <p className="m-0 mt-3 text-[14px] font-light leading-relaxed text-[var(--som-gray)]">
          Vous êtes sur le point de supprimer <strong className="font-medium text-[var(--som-ink)]">{name}</strong>.
          Cette action est irréversible et supprimera également toutes les images associées.
        </p>
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={isDeleting} className="btn-secondary btn-sm">
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn-primary btn-sm bg-[var(--som-error)]! hover:opacity-90"
          >
            {isDeleting && <Loader2 size={15} strokeWidth={1.5} className="animate-spin" aria-hidden />}
            {isDeleting ? "Suppression…" : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
