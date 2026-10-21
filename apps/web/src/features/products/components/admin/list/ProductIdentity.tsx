import Link from "next/link";
import { Badge } from "@/shared/components/admin/ui/Badge";
import { ADMIN_PRODUCTS_PATH } from "@/features/products/constants";
import type { Product } from "@/features/products/types";
import { ProductThumb } from "./ProductThumb";

export function ProductIdentity({ product }: { product: Product }) {
  const hasTags = product.is_new || product.is_featured || product.is_bestseller;
  return (
    <div className="flex min-w-0 items-center gap-4">
      <ProductThumb src={product.images[0]} dimmed={!product.is_active} />
      <div className="min-w-0">
        <Link
          href={`${ADMIN_PRODUCTS_PATH}/${product.id}`}
          className="line-clamp-2 text-[14px] font-medium leading-snug text-[var(--som-ink)] hover:text-[var(--som-primary)]"
        >
          {product.name}
        </Link>
        <p className="m-0 mt-0.5 truncate text-[12px] font-light text-[var(--som-gray)]">
          {product.category?.name || "Sans catégorie"}
        </p>
        {hasTags && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {product.is_new && <Badge>Nouveau</Badge>}
            {product.is_featured && <Badge tone="primary">Coup de cœur</Badge>}
            {product.is_bestseller && <Badge>Best-seller</Badge>}
          </div>
        )}
      </div>
    </div>
  );
}
