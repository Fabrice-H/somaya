import { Loader2 } from "lucide-react";

type CategoryFormActionsProps = {
  isDirty: boolean;
  loading: boolean;
  canSubmit: boolean;
};

export function CategoryFormActions({ isDirty, loading, canSubmit }: CategoryFormActionsProps) {
  return (
    <>
      {isDirty && (
        <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--som-gray)]">
          Modifications non enregistrées
        </span>
      )}
      <button type="submit" disabled={loading || !canSubmit} className="btn-primary btn-sm">
        {loading && <Loader2 size={15} strokeWidth={1.5} className="animate-spin" aria-hidden />}
        {loading ? "Enregistrement…" : "Enregistrer"}
      </button>
    </>
  );
}
