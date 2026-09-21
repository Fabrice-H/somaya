import Image from "next/image";
import Link from "next/link";
import { Edit, Eye, Package, Sparkles, Star, Trash2 } from "lucide-react";
import { formatPrice } from "@/shared/lib/format";
import { ADMIN_PRODUCTS_PATH } from "@/features/products/constants";
import { isLowStock } from "@/features/products/utils";
import type { Product } from "@/features/products/types";

const BADGE_CLASS = "px-2 py-1 text-white text-[10px] font-bold uppercase";
const ACTION_CLASS = "w-10 h-10 flex items-center justify-center bg-white transition-colors";

interface AdminProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

export function AdminProductCard({ product, onDelete }: AdminProductCardProps) {
  const cover = product.images[0];

  return (
    <div className="group relative bg-[#fafafa] border border-[#511f29]/10 overflow-hidden">
      <div className="relative aspect-square bg-[#eeeeec]">
        {cover ? (
          <Image src={cover} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package size={32} className="text-[#6b6b6b] opacity-50" />
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.stock <= 0 && <span className={`${BADGE_CLASS} bg-red-600`}>Épuisé</span>}
          {isLowStock(product) && <span className={`${BADGE_CLASS} bg-amber-500`}>Stock faible</span>}
          {product.is_new && <span className={`${BADGE_CLASS} bg-blue-600`}>Nouveau</span>}
          {product.is_featured && <span className={`${BADGE_CLASS} bg-[#511f29]`}>Vedette</span>}
        </div>

        {!product.is_active && (
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <span className={`${BADGE_CLASS} bg-gray-600`}>Inactif</span>
          </div>
        )}

        {product.stock > 0 && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-[10px] font-medium">
            Stock: {product.stock}
          </div>
        )}

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link
            href={`${ADMIN_PRODUCTS_PATH}/${product.id}`}
            aria-label="Modifier"
            className={`${ACTION_CLASS} text-[#000000] hover:bg-[#f1e1e5]`}
          >
            <Edit size={16} />
          </Link>
          <Link
            href={`/produit/${product.slug}`}
            target="_blank"
            aria-label="Voir sur la boutique"
            className={`${ACTION_CLASS} text-[#000000] hover:bg-[#f1e1e5]`}
          >
            <Eye size={16} />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(product.id)}
            aria-label="Supprimer"
            className={`${ACTION_CLASS} text-red-600 hover:bg-red-50`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-medium text-[#000000] line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            {product.is_featured && <Star size={12} className="text-amber-500 fill-amber-500" />}
            {product.is_bestseller && <Sparkles size={12} className="text-[#3c161e]" />}
          </div>
        </div>
        <p className="text-xs text-[#6b6b6b] mb-2 line-clamp-1">{product.category?.name || "Sans catégorie"}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-[#000000]">{formatPrice(product.price)}</span>
            {product.old_price && (
              <span className="text-xs text-[#6b6b6b] line-through ml-2">{formatPrice(product.old_price)}</span>
            )}
          </div>
          {product.sku && <span className="text-[10px] text-[#6b6b6b] font-mono">{product.sku}</span>}
        </div>
      </div>
    </div>
  );
}
