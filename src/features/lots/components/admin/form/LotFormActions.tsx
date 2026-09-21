import { Loader2, Trash2 } from "lucide-react";

type LotFormActionsProps = {
  isEdit: boolean;
  canSubmit: boolean;
  isPending: boolean;
  onDelete: () => void;
};

export function LotFormActions({ isEdit, canSubmit, isPending, onDelete }: LotFormActionsProps) {
  return (
    <>
      {isEdit && (
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex min-h-10 cursor-pointer items-center gap-2 px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--som-error)] transition-colors hover:bg-[var(--som-error-tint)]"
        >
          <Trash2 size={15} strokeWidth={1.5} aria-hidden />
          Supprimer
        </button>
      )}
      <button type="submit" disabled={isPending || !canSubmit} className="btn-primary btn-sm">
        {isPending && <Loader2 size={15} strokeWidth={1.5} className="animate-spin" aria-hidden />}
        {isPending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </>
  );
}
