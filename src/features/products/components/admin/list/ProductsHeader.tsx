import Link from "next/link";
import { Plus } from "lucide-react";
import { ADMIN_PRODUCTS_PATH } from "@/features/products/constants";

export function ProductsHeader() {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#000000] mb-1">Produits</h1>
        <p className="text-sm text-[#6b6b6b]">Gérez votre catalogue de produits</p>
      </div>
      <Link
        href={`${ADMIN_PRODUCTS_PATH}/nouveau`}
        className="inline-flex items-center gap-2 h-11 px-6 bg-[#511f29] text-white text-sm font-semibold transition-colors hover:bg-[#3d171f]"
      >
        <Plus size={18} />
        Nouveau produit
      </Link>
    </div>
  );
}
