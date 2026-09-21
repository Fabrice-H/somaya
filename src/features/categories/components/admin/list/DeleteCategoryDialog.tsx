import { Loader2 } from "lucide-react";

type DeleteCategoryDialogProps = {
  name: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteCategoryDialog({ name, loading, onCancel, onConfirm }: DeleteCategoryDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => !loading && onCancel()} />

      <div role="dialog" aria-modal="true" className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-[#000000] mb-2">Supprimer la catégorie ?</h3>
        <p className="text-sm text-[#4a4a4a] mb-6 leading-relaxed">
          Êtes-vous sûr de vouloir supprimer &quot;{name}&quot; ? Les produits associés ne seront pas supprimés mais
          perdront leur catégorie.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium border border-[#511f29]/20 text-[#000000] hover:bg-[#fafafa] transition-colors rounded"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors rounded flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
