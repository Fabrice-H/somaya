import { FolderOpen } from "lucide-react";

export function CategoriesEmptyState() {
  return (
    <div className="text-center bg-[#fafafa] border border-[#511f29]/10" style={{ padding: "64px 24px" }}>
      <FolderOpen size={48} className="text-[#6b6b6b] mx-auto mb-4" />
      <p className="text-base font-medium text-[#000000] mb-1">Aucune catégorie</p>
      <p className="text-sm text-[#6b6b6b]">Créez votre première catégorie pour organiser vos produits</p>
    </div>
  );
}
