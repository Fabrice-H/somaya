"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import { useProductListParams } from "@/features/products/hooks/useProductListParams";
import { useDeleteProduct } from "@/features/products/hooks/useDeleteProduct";
import { ADMIN_PRODUCTS_PATH, ADMIN_PRODUCTS_PER_PAGE } from "@/features/products/constants";
import { computeProductStats, filterAdminProducts } from "@/features/products/utils";
import type { CategoryOption, Product } from "@/features/products/types";
import { DeleteProductDialog } from "./DeleteProductDialog";
import { ProductListFilters } from "./list/ProductListFilters";
import { ProductsEmptyState } from "./list/ProductsEmptyState";
import { ProductsPagination } from "./list/ProductsPagination";
import { ProductStatsGrid } from "./list/ProductStatsGrid";
import { ProductsTable } from "./list/ProductsTable";
import { SavedNotice } from "./list/SavedNotice";
import { useToggleVisibility } from "./list/useToggleVisibility";

interface ProductsClientProps {
  products: Product[];
  categories: CategoryOption[];
}

function pluralize(count: number) {
  return `produit${count > 1 ? "s" : ""}`;
}

export function ProductsClient({ products, categories }: ProductsClientProps) {
  const { page, query, categoryId, stock, saved, isPending, update } = useProductListParams();
  const deletion = useDeleteProduct();
  const visibility = useToggleVisibility();

  const filtered = useMemo(
    () => filterAdminProducts(products, { query, categoryId, stock }),
    [products, query, categoryId, stock]
  );
  const stats = useMemo(() => computeProductStats(products), [products]);

  const totalPages = Math.ceil(filtered.length / ADMIN_PRODUCTS_PER_PAGE);
  const start = (page - 1) * ADMIN_PRODUCTS_PER_PAGE;
  const visible = filtered.slice(start, start + ADMIN_PRODUCTS_PER_PAGE);

  return (
    <AdminPage
      eyebrow="Catalogue"
      title="Produits"
      description="Ajoutez, modifiez ou masquez les pièces de votre boutique."
      actions={
        <Link href={`${ADMIN_PRODUCTS_PATH}/nouveau`} className="btn-primary btn-sm">
          <Plus size={16} strokeWidth={1.5} aria-hidden />
          Ajouter un produit
        </Link>
      }
    >
      {saved && <SavedNotice created={saved === "created"} onDismiss={() => update({})} />}
      <ProductStatsGrid stats={stats} />
      <ProductListFilters
        filters={{ query, categoryId, stock }}
        categories={categories}
        resultLabel={
          filtered.length === products.length
            ? `${products.length} ${pluralize(products.length)}`
            : `${filtered.length} sur ${products.length}`
        }
        onChange={update}
      />

      {visible.length === 0 ? (
        <ProductsEmptyState filtered={Boolean(query || categoryId || stock)} />
      ) : (
        <ProductsTable
          products={visible}
          pendingId={visibility.pendingId}
          onToggleVisibility={visibility.toggle}
          onDelete={deletion.request}
        />
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
          <p className="m-0">
            Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible et supprimera également toutes
            les images associées.
          </p>
        </DeleteProductDialog>
      )}
    </AdminPage>
  );
}
