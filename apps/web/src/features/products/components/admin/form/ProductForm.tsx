"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import { useProductFormStore } from "@/features/products/stores/product-form-store";
import { useProductSubmit } from "@/features/products/hooks/useProductSubmit";
import { useDeleteProduct } from "@/features/products/hooks/useDeleteProduct";
import { ADMIN_PRODUCTS_PATH } from "@/features/products/constants";
import type { CategoryOption, Product } from "@/features/products/types";
import { DeleteProductDialog } from "../DeleteProductDialog";
import { AdvancedSection } from "./AdvancedSection";
import { InfoSection } from "./InfoSection";
import { PhotosSection } from "./PhotosSection";
import { PriceSection } from "./PriceSection";
import { ProductFormActions } from "./ProductFormActions";
import { SaveBar } from "./SaveBar";
import { StockSection } from "./StockSection";
import { VisibilitySection } from "./VisibilitySection";

interface ProductFormProps {
  product?: Product;
  categories: CategoryOption[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const initialize = useProductFormStore((s) => s.initialize);
  const name = useProductFormStore((s) => s.form.name);
  const handleSubmit = useProductSubmit(product?.id);
  const deletion = useDeleteProduct(() => {
    router.push(ADMIN_PRODUCTS_PATH);
    router.refresh();
  });

  useEffect(() => {
    initialize(product);
    return () => initialize();
  }, [product, initialize]);

  const isEditMode = Boolean(product);

  return (
    <form onSubmit={handleSubmit}>
      <AdminPage
        eyebrow="Catalogue"
        title={isEditMode ? "Modifier le produit" : "Ajouter un produit"}
        description={isEditMode ? name || undefined : "Remplissez les étapes ci-dessous puis enregistrez."}
        back={{ href: ADMIN_PRODUCTS_PATH, label: "Tous les produits" }}
        actions={product && <ProductFormActions onDelete={() => deletion.request(product.id)} />}
      >
        <div className="flex max-w-[880px] flex-col gap-6">
          <PhotosSection />
          <InfoSection categories={categories} isEditMode={isEditMode} />
          <PriceSection />
          <StockSection />
          <VisibilitySection />
          <AdvancedSection />
        </div>
        <SaveBar />
      </AdminPage>

      {deletion.targetId && (
        <DeleteProductDialog isDeleting={deletion.isDeleting} onCancel={deletion.cancel} onConfirm={deletion.confirm}>
          <p className="m-0 mb-2">
            Vous êtes sur le point de supprimer{" "}
            <strong className="font-medium text-[var(--som-ink)]">{product?.name}</strong>.
          </p>
          <p className="m-0">
            Cette action est irréversible et supprimera également toutes les images et lots associés.
          </p>
        </DeleteProductDialog>
      )}
    </form>
  );
}
