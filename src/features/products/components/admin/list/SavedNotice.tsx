import { Check, X } from "lucide-react";

export function SavedNotice({ created, onDismiss }: { created: boolean; onDismiss: () => void }) {
  return (
    <div
      role="status"
      className="mb-6 flex items-center gap-3 border border-[var(--som-border)] border-l-2 border-l-[var(--som-success)] bg-white py-2 pl-4 pr-2 text-[14px] text-[var(--som-ink)]"
    >
      <Check size={16} strokeWidth={1.5} aria-hidden className="shrink-0 text-[var(--som-success)]" />
      <p className="m-0 flex-1">
        {created ? "Le produit a bien été ajouté." : "Les modifications ont bien été enregistrées."}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fermer le message"
        className="flex h-10 w-10 cursor-pointer items-center justify-center text-[var(--som-gray)] hover:text-[var(--som-ink)]"
      >
        <X size={16} strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );
}
