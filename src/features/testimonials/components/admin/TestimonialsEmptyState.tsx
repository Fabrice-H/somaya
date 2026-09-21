import { Star } from "lucide-react";

export function TestimonialsEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="bg-white p-12 rounded-lg border border-[#511f29]/10 text-center">
      <Star size={48} className="mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Aucun témoignage</p>
      <button type="button" onClick={onAdd} className="mt-4 text-[#3c161e] font-medium hover:underline">
        Ajouter le premier
      </button>
    </div>
  );
}
