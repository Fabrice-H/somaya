import { Loader2 } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Field } from "@/shared/components/admin/ui/Field";
import type { CollectionDraft } from "../../../types";
import { ColorSelect } from "./ColorSelect";

type NewCollectionFormProps = {
  draft: CollectionDraft;
  saving: boolean;
  onChange: (draft: CollectionDraft) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function NewCollectionForm({ draft, saving, onChange, onSubmit, onCancel }: NewCollectionFormProps) {
  return (
    <AdminCard title="Nouvelle collection">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field id="new_collection_name" label="Nom de la collection" required>
            <input
              id="new_collection_name"
              type="text"
              value={draft.name}
              onChange={(event) => onChange({ ...draft, name: event.target.value })}
              placeholder="Ex. Élégance"
              className="input-som"
            />
          </Field>
        </div>
        <Field id="new_collection_year" label="Année">
          <input
            id="new_collection_year"
            type="text"
            inputMode="numeric"
            value={draft.year}
            onChange={(event) => onChange({ ...draft, year: event.target.value })}
            placeholder="Ex. 2025"
            className="input-som"
          />
        </Field>
        <Field id="new_collection_color" label="Couleur de fond">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="h-8 w-8 shrink-0 rounded-full border border-[var(--som-border)]"
              style={{ backgroundColor: draft.backgroundColor }}
            />
            <ColorSelect
              id="new_collection_color"
              value={draft.backgroundColor}
              onChange={(backgroundColor) => onChange({ ...draft, backgroundColor })}
              className="input-som"
            />
          </div>
        </Field>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-[var(--som-border)] pt-6">
        <button type="button" onClick={onSubmit} disabled={saving || !draft.name.trim()} className="btn-primary">
          {saving && <Loader2 size={15} strokeWidth={1.5} className="animate-spin" aria-hidden />}
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Annuler
        </button>
      </div>
    </AdminCard>
  );
}
