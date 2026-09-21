import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";

type LotFormHeaderProps = {
  isEdit: boolean;
  name: string;
  isPending: boolean;
  onBack: () => void;
  onDelete: () => void;
};

export function LotFormHeader({ isEdit, name, isPending, onBack, onDelete }: LotFormHeaderProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 flex-wrap bg-[#fafafa] border-b border-[var(--som-border)]"
      style={{ padding: "24px 40px" }}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Retour"
          className="w-10 h-10 flex items-center justify-center border border-[var(--som-border)] hover:bg-white transition-colors"
        >
          <ArrowLeft size={18} className="text-[#000000]" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-[#000000]">{isEdit ? "Modifier le lot" : "Nouveau lot de prix"}</h1>
          {name && <p className="text-sm text-[#6b6b6b] mt-0.5">{name}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isEdit && (
          <button
            type="button"
            onClick={onDelete}
            className="h-11 px-4 flex items-center gap-2 border border-red-500 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        )}
        <button
          type="submit"
          disabled={isPending || !name}
          className="inline-flex items-center gap-2 h-11 px-6 bg-[#511f29] text-white text-sm font-semibold transition-colors hover:bg-[#3d171f] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
