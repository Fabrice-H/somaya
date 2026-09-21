import type { ReactNode } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteProductDialogProps {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  children: ReactNode;
}

export function DeleteProductDialog({ isDeleting, onCancel, onConfirm, children }: DeleteProductDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div role="alertdialog" aria-modal="true" className="bg-white p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
            <AlertTriangle size={20} />
          </div>
          <h3 className="text-lg font-semibold text-[#000000]">Supprimer le produit</h3>
        </div>
        <div className="mb-6">{children}</div>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="h-10 px-4 text-sm text-[#000000] hover:bg-[#fafafa] transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-10 px-4 bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isDeleting && <Loader2 size={14} className="animate-spin" />}
            {isDeleting ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
