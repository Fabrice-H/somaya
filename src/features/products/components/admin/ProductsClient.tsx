"use client";

import { useMemo } from "react";
import { useProductListParams } from "@/features/products/hooks/useProductListParams";
import { useDeleteProduct } from "@/features/products/hooks/useDeleteProduct";
import { ADMIN_PRODUCTS_PER_PAGE } from "@/features/products/constants";
import { computeProductStats, filterAdminProducts } from "@/features/products/utils";
import type { CategoryOption, Product } from "@/features/products/types";
import { DeleteProductDialog } from "./DeleteProductDialog";
import { AdminProductCard } from "./list/AdminProductCard";
import { ProductListFilters } from "./list/ProductListFilters";
import { ProductsEmptyState } from "./list/ProductsEmptyState";
import { ProductsHeader } from "./list/ProductsHeader";
import { ProductsPagination } from "./list/ProductsPagination";
import { ProductStatsGrid } from "./list/ProductStatsGrid";

interface ProductsClientProps {
  products: Product[];
  categories: CategoryOption[];
}

function pluralize(count: number) {
  return `produit${count > 1 ? "s" : ""}`;
}

export function ProductsClient({ products, categories }: ProductsClientProps) {
  const { page, query, categoryId, stock, isPending, update } = useProductListParams();
  const deletion = useDeleteProduct();

  const filtered = useMemo(
    () => filterAdminProducts(products, { query, categoryId, stock }),
    [products, query, categoryId, stock]
  );
  const stats = useMemo(() => computeProductStats(products), [products]);

  const totalPages = Math.ceil(filtered.length / ADMIN_PRODUCTS_PER_PAGE);
  const start = (page - 1) * ADMIN_PRODUCTS_PER_PAGE;
  const visible = filtered.slice(start, start + ADMIN_PRODUCTS_PER_PAGE);

  return (
    <div style={{ padding: "32px 40px" }}>
      <ProductsHeader />
      <ProductStatsGrid stats={stats} />
      <ProductListFilters filters={{ query, categoryId, stock }} categories={categories} onChange={update} />

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#6b6b6b]">
          {filtered.length === products.length
            ? `${products.length} ${pluralize(products.length)}`
            : `${filtered.length} sur ${products.length} ${pluralize(products.length)}`}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-[#6b6b6b]">
            Page {page} sur {totalPages}
          </p>
        )}
      </div>

      {visible.length === 0 ? (
        <ProductsEmptyState filtered={Boolean(query || categoryId || stock)} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map((product) => (
            <AdminProductCard key={product.id} product={product} onDelete={deletion.request} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <ProductsPagination
          page={page}
          totalPages={totalPages}
          disabled={isPending}
          onPageChange={(next) => update({ page: String(next) })}
        />
      )}

      {deletion.targetId && (
        <DeleteProductDialog isDeleting={deletion.isDeleting} onCancel={deletion.cancel} onConfirm={deletion.confirm}>
          <p className="text-sm text-[#6b6b6b]">
            Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible et supprimera également toutes
            les images associées.
          </p>
        </DeleteProductDialog>
      )}
    </div>
  );
}
