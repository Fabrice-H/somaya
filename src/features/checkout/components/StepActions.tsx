import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

type StepActionsProps = {
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  pending?: boolean;
};

export function StepActions({ onBack, onNext, nextLabel, pending = false }: StepActionsProps) {
  return (
    <div className="mt-10 flex gap-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Étape précédente"
          className="btn-secondary h-14 px-6 text-[var(--som-ink)] [border-color:var(--som-border-strong)] hover:bg-[var(--som-surface-alt)] hover:text-[var(--som-ink)]"
        >
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
          <span className="hidden sm:inline">Retour</span>
        </button>
      )}
      <button type="button" onClick={onNext} disabled={pending} className="btn-primary h-14 flex-1 px-4">
        {pending && <Loader2 size={16} className="animate-spin" aria-hidden />}
        {nextLabel}
        {!pending && <ArrowRight size={16} strokeWidth={1.5} aria-hidden />}
      </button>
    </div>
  );
}
