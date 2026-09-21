import { ArrowLeft, Loader2, Save } from "lucide-react";

type CategoryFormHeaderProps = {
  isEdit: boolean;
  name: string;
  isDirty: boolean;
  loading: boolean;
  canSubmit: boolean;
  onBack: () => void;
};

export function CategoryFormHeader({ isEdit, name, isDirty, loading, canSubmit, onBack }: CategoryFormHeaderProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 flex-wrap bg-[#fafafa] border-b border-[#511f29]/10"
      style={{ padding: "24px 40px" }}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Retour"
          className="w-10 h-10 flex items-center justify-center border border-[#511f29]/20 hover:bg-white transition-colors"
        >
          <ArrowLeft size={18} className="text-[#000000]" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-[#000000]">
            {isEdit ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h1>
          {name && <p className="text-sm text-[#6b6b6b] mt-0.5">{name}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isDirty && <span className="text-xs text-[#A08050]">Modifications non enregistrées</span>}
        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="inline-flex items-center gap-2 h-11 px-6 bg-[#511f29] text-white text-sm font-semibold transition-colors hover:bg-[#3d171f] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
