import { Package } from "lucide-react";

export function ProductsEmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="text-center py-16 text-[#6b6b6b]">
      <Package size={48} className="mx-auto mb-4 opacity-50" />
      <p className="text-lg mb-2">Aucun produit trouvé</p>
      <p className="text-sm">
        {filtered ? "Essayez de modifier vos filtres" : "Commencez par ajouter votre premier produit"}
      </p>
    </div>
  );
}
