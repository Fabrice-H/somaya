import { Loader2, Save } from "lucide-react";
import type { CollectionDraft } from "../../../types";
import { ColorSelect } from "./ColorSelect";
import { cardStyle, inputClass, labelClass, primaryButtonClass } from "./styles";

type NewCollectionFormProps = {
  draft: CollectionDraft;
  saving: boolean;
  onChange: (draft: CollectionDraft) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function NewCollectionForm({ draft, saving, onChange, onSubmit, onCancel }: NewCollectionFormProps) {
  return (
    <div className="bg-white" style={cardStyle}>
      <h2 className="text-base font-semibold text-[#000000] mb-4">Nouvelle collection</h2>

      <div className="space-y-5">
        <div>
          <label className={labelClass}>Nom de la collection *</label>
          <input
            type="text"
            value={draft.name}
            onChange={(event) => onChange({ ...draft, name: event.target.value })}
            placeholder="Ex: Élégance"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Année</label>
            <input
              type="text"
              value={draft.year}
              onChange={(event) => onChange({ ...draft, year: event.target.value })}
              placeholder="Ex: 2025"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Couleur de fond</label>
            <ColorSelect
              value={draft.backgroundColor}
              onChange={(backgroundColor) => onChange({ ...draft, backgroundColor })}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6 pt-4 border-t border-black">
        <button
          type="button"
          onClick={onSubmit}
          disabled={saving || !draft.name.trim()}
          className={`${primaryButtonClass} h-11 px-6 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-11 px-6 border border-black text-[#000000] text-sm font-medium hover:bg-[#fafafa] transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
