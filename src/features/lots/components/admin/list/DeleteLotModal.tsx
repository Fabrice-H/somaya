import { AlertTriangle } from "lucide-react";

type DeleteLotModalProps = {
  name: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteLotModal({ name, isLoading, onConfirm, onCancel }: DeleteLotModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-start gap-4 p-6 pb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#000000]">Supprimer ce lot ?</h3>
            <p className="mt-2 text-[15px] text-[#6b6b6b] leading-relaxed">
              Êtes-vous sûr de vouloir supprimer le lot &quot;{name}&quot; ? Cette action est irréversible et supprimera
              également toutes les images associées.
            </p>
          </div>
        </div>

        <div className="flex gap-3 p-6 pt-4 bg-[#fafafa]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-5 py-2.5 text-[14px] font-medium text-[#000000] bg-white border border-[#e8ddd4] rounded-lg hover:bg-[#fafafa] transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-5 py-2.5 text-[14px] font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
