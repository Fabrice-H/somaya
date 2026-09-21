import clsx from "clsx";
import { Plus, Star } from "lucide-react";
import type { TestimonialsFeedback } from "@/features/testimonials/types";

type TestimonialsManagerHeaderProps = {
  embedded: boolean;
  feedback: TestimonialsFeedback | null;
  onAdd: () => void;
};

export function TestimonialsManagerHeader({ embedded, feedback, onAdd }: TestimonialsManagerHeaderProps) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between gap-4",
        embedded ? "p-4 border-b border-[#511f29]/10" : "bg-[#fafafa] border-b border-[#511f29]/10"
      )}
      style={embedded ? undefined : { padding: "24px 40px" }}
    >
      <div className="flex items-center gap-3">
        {!embedded && (
          <div className="w-10 h-10 bg-[#511f29] text-white flex items-center justify-center rounded-lg">
            <Star size={20} />
          </div>
        )}
        <div>
          <h2 className={clsx(embedded ? "text-lg" : "text-xl", "font-semibold text-[#000000]")}>
            {embedded ? "Gérer les témoignages" : "Témoignages"}
          </h2>
          <p className="text-sm text-[#4a4a4a]">Gérez les avis clients affichés sur la page d&apos;accueil</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {feedback && (
          <span className={clsx("text-sm", feedback.type === "success" ? "text-green-600" : "text-red-600")}>
            {feedback.text}
          </span>
        )}
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#511f29] text-white text-sm font-medium rounded-lg hover:bg-[#3d161f] transition-colors"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>
    </div>
  );
}
