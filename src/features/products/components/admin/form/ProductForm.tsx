"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductFormMeta, useProductFormStore } from "@/features/products/stores/product-form-store";
import { useProductSubmit } from "@/features/products/hooks/useProductSubmit";
import { useDeleteProduct } from "@/features/products/hooks/useDeleteProduct";
import { ADMIN_PRODUCTS_PATH } from "@/features/products/constants";
import type { CategoryOption, Product, ProductFormTab } from "@/features/products/types";
import { DeleteProductDialog } from "../DeleteProductDialog";
import { GeneralSection } from "./GeneralSection";
import { ImagesSection } from "./ImagesSection";
import { PricingSection } from "./PricingSection";
import { ProductFormHeader } from "./ProductFormHeader";
import { ProductFormTabs } from "./ProductFormTabs";
import { StatusSection } from "./StatusSection";

interface ProductFormProps {
  product?: Product;
  categories: CategoryOption[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProductFormTab>("general");
  const initialize = useProductFormStore((s) => s.initialize);
  const { error } = useProductFormMeta();
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
      <ProductFormHeader isEditMode={isEditMode} onDelete={() => product && deletion.request(product.id)} />
      <ProductFormTabs active={activeTab} onChange={setActiveTab} />

      {error && <div className="mx-10 mt-6 p-4 bg-red-50 border border-red-200 text-red-700">{error}</div>}

      <div style={{ padding: "32px 40px" }}>
        {activeTab === "general" && (
          <div style={{ maxWidth: 800 }}>
            <GeneralSection categories={categories} isEditMode={isEditMode} />
          </div>
        )}
        {activeTab === "images" && (
          <div style={{ maxWidth: 800 }}>
            <ImagesSection />
          </div>
        )}
        {activeTab === "pricing" && (
          <div style={{ maxWidth: 600 }}>
            <PricingSection />
          </div>
        )}
        {activeTab === "settings" && (
          <div style={{ maxWidth: 600 }}>
            <StatusSection />
          </div>
        )}
      </div>

      {deletion.targetId && (
        <DeleteProductDialog isDeleting={deletion.isDeleting} onCancel={deletion.cancel} onConfirm={deletion.confirm}>
          <p className="text-sm text-[#6b6b6b] mb-2">
            Vous êtes sur le point de supprimer <strong className="text-[#000000]">{product?.name}</strong>.
          </p>
          <p className="text-sm text-[#6b6b6b]">
            Cette action est irréversible et supprimera également toutes les images et lots associés.
          </p>
        </DeleteProductDialog>
      )}
    </form>
  );
}
