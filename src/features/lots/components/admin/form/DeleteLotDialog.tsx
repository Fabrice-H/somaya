import { AlertTriangle, Loader2 } from "lucide-react";

type DeleteLotDialogProps = {
  name: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteLotDialog({ name, isDeleting, onCancel, onConfirm }: DeleteLotDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div role="dialog" aria-modal="true" className="bg-white p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
            <AlertTriangle size={20} />
          </div>
          <h3 className="text-lg font-semibold text-[#000000]">Supprimer le lot</h3>
        </div>
        <p className="text-sm text-[#6b6b6b] mb-2">
          Vous êtes sur le point de supprimer <strong className="text-[#000000]">{name}</strong>.
        </p>
        <p className="text-sm text-[#6b6b6b] mb-6">
          Cette action est irréversible et supprimera également toutes les images associées.
        </p>
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
