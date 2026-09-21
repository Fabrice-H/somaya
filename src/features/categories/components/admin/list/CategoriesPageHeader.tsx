import Link from "next/link";
import { Plus } from "lucide-react";
import { ADMIN_CATEGORIES_PATH } from "@/features/categories/constants";

export function CategoriesPageHeader() {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#000000] mb-1">Catégories</h1>
        <p className="text-sm text-[#6b6b6b]">Gérez les catégories de votre catalogue</p>
      </div>
      <Link
        href={`${ADMIN_CATEGORIES_PATH}/nouveau`}
        className="inline-flex items-center gap-2 h-11 px-6 bg-[#511f29] text-white text-sm font-semibold transition-colors hover:bg-[#3d171f]"
      >
        <Plus size={18} />
        Nouvelle catégorie
      </Link>
    </div>
  );
}
