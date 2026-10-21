import Link from "next/link";
import { Pencil } from "lucide-react";
import { ADMIN_PRODUCTS_PATH } from "@/features/products/constants";
import type { Product } from "@/features/products/types";
import { ProductRowMenu } from "./ProductRowMenu";

interface ProductRowActionsProps {
  product: Product;
  busy: boolean;
  onToggleVisibility: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductRowActions({ product, busy, onToggleVisibility, onDelete }: ProductRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`${ADMIN_PRODUCTS_PATH}/${product.id}`} className="btn-secondary btn-sm !px-4">
        <Pencil size={14} strokeWidth={1.5} aria-hidden />
        Modifier
      </Link>
      <ProductRowMenu
        product={product}
        busy={busy}
        onToggleVisibility={() => onToggleVisibility(product)}
        onDelete={() => onDelete(product.id)}
      />
    </div>
  );
}
