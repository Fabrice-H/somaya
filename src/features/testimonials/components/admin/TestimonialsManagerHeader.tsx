import { Plus } from "lucide-react";
import type { TestimonialsFeedback } from "@/features/testimonials/types";

type TestimonialsActionsProps = {
  feedback: TestimonialsFeedback | null;
  onAdd: () => void;
};

export function TestimonialsActions({ feedback, onAdd }: TestimonialsActionsProps) {
  return (
    <>
      {feedback && (
        <span
          role="status"
          className={`text-[12px] ${feedback.type === "success" ? "text-[var(--som-success)]" : "text-[var(--som-error)]"}`}
        >
          {feedback.text}
        </span>
      )}
      <button type="button" onClick={onAdd} className="btn-primary btn-sm">
        <Plus size={16} strokeWidth={1.5} aria-hidden />
        Ajouter
      </button>
    </>
  );
}

export function TestimonialsManagerHeader(props: TestimonialsActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--som-border)] p-4">
      <div className="min-w-0">
        <h2 className="m-0 text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--som-ink)]">
          Gérer les témoignages
        </h2>
        <p className="m-0 mt-1 text-[13px] font-light text-[var(--som-gray)]">
          Avis clients affichés sur la page d&apos;accueil.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <TestimonialsActions {...props} />
      </div>
    </div>
  );
}
