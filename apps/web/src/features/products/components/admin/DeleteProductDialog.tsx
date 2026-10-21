import type { ReactNode } from "react";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteProductDialogProps {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  children: ReactNode;
}

export function DeleteProductDialog({ isDeleting, onCancel, onConfirm, children }: DeleteProductDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-product-title"
        className="w-full max-w-[420px] border border-[var(--som-border)] bg-white shadow-[0_18px_30px_-20px_rgba(0,0,0,0.18)]"
      >
        <div className="p-6">
          <span className="flex h-10 w-10 items-center justify-center bg-[var(--som-error-tint)] text-[var(--som-error)]">
            <Trash2 size={17} strokeWidth={1.5} aria-hidden />
          </span>
          <h3
            id="delete-product-title"
            className="m-0 mt-5 text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--som-ink)]"
          >
            Supprimer le produit
          </h3>
          <div className="mt-2 text-[14px] font-light leading-relaxed text-[var(--som-gray)]">{children}</div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--som-border)] px-6 py-4">
          <button type="button" onClick={onCancel} disabled={isDeleting} className="btn-secondary btn-sm">
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn-primary btn-sm !bg-[var(--som-error)] hover:opacity-90"
          >
            {isDeleting && <Loader2 size={14} className="animate-spin" aria-hidden />}
            {isDeleting ? "Suppression…" : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
