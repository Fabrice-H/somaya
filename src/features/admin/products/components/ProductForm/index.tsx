"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Save,
  ArrowLeft,
  Package,
  Image as ImageIcon,
  DollarSign,
  Settings2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  useProductFormStore,
  useProductFormMeta,
} from "../../store";
import { useProductMutations } from "../../hooks";
import { productSchema } from "../../schemas";
import { deleteProduct } from "../../actions";
import { GeneralSection } from "./GeneralSection";
import { ImagesSection } from "./ImagesSection";
import { PricingSection } from "./PricingSection";
import { StatusSection } from "./StatusSection";
import type { Product, ProductFormProps } from "../../types";

type TabKey = "general" | "images" | "pricing" | "settings";

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useProductFormStore((s) => s.form);
  const { isDirty, isSubmitting, error } = useProductFormMeta();
  const setSubmitting = useProductFormStore((s) => s.setSubmitting);
  const setError = useProductFormStore((s) => s.setError);
  const initializeFromProduct = useProductFormStore(
    (s) => s.initializeFromProduct
  );
  const resetForm = useProductFormStore((s) => s.resetForm);

  const { createMutation, updateMutation } = useProductMutations();

  // Initialize form from product if editing
  useEffect(() => {
    if (product) {
      initializeFromProduct(product);
    } else {
      resetForm();
    }

    // Cleanup on unmount
    return () => {
      resetForm();
    };
  }, [product, initializeFromProduct, resetForm]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Validate with Zod
      const parsed = productSchema.safeParse(form);
      if (!parsed.success) {
        setError(parsed.error.issues[0].message);
        return;
      }

      setSubmitting(true);

      try {
        if (product) {
          const result = await updateMutation.mutateAsync({
            id: product.id,
            data: parsed.data,
          });

          if (!result.success) {
            setError(result.error || "Erreur lors de la mise à jour");
            return;
          }
        } else {
          const result = await createMutation.mutateAsync(parsed.data);

          if (!result.success) {
            setError(result.error || "Erreur lors de la création");
            return;
          }
        }

        router.push("/admin/produits");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      form,
      product,
      createMutation,
      updateMutation,
      router,
      setError,
      setSubmitting,
    ]
  );

  const handleDelete = async () => {
    if (!product) return;

    setIsDeleting(true);
    try {
      const result = await deleteProduct(product.id);
      if (!result.success) {
        alert(result.error || "Erreur lors de la suppression");
        return;
      }
      router.push("/admin/produits");
      router.refresh();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Une erreur est survenue");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const isEditMode = !!product;

  // Tab configuration
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "general", label: "Général", icon: <Package size={16} /> },
    { key: "images", label: "Images", icon: <ImageIcon size={16} /> },
    { key: "pricing", label: "Prix & Stock", icon: <DollarSign size={16} /> },
    { key: "settings", label: "Options", icon: <Settings2 size={16} /> },
  ];

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div
        className="flex items-center justify-between gap-4 flex-wrap bg-[#faf6f1] border-b border-[#511F29]/10"
        style={{ padding: "24px 40px" }}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center border border-[#511F29]/20 hover:bg-white transition-colors"
          >
            <ArrowLeft size={18} className="text-[#2a181d]" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-[#2a181d]">
              {isEditMode ? "Modifier le produit" : "Nouveau produit"}
            </h1>
            {form.name && (
              <p className="text-sm text-[#94786b] mt-0.5">{form.name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-xs text-[#A08050]">
              Modifications non enregistrées
            </span>
          )}
          {isEditMode && (
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="h-11 px-4 flex items-center gap-2 border border-red-500 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} />
              Supprimer
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !form.name || !form.slug}
            className="inline-flex items-center gap-2 h-11 px-6 bg-[#511F29] text-[#fcd3b4] text-sm font-semibold transition-colors hover:bg-[#3d171f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 overflow-x-auto bg-[#faf6f1] border-b border-[#511F29]/10"
        style={{ padding: "0 40px" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className="inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            style={{
              padding: "14px 20px",
              fontSize: 13,
              fontWeight: 500,
              color: activeTab === tab.key ? "#511F29" : "#94786b",
              borderBottom:
                activeTab === tab.key
                  ? "2px solid #511F29"
                  : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div
          className="mx-10 mt-6 p-4 bg-red-50 border border-red-200 text-red-700"
          style={{ marginLeft: 40, marginRight: 40 }}
        >
          {error}
        </div>
      )}

      {/* Content */}
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

      {/* Delete confirmation modal */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-lg font-semibold text-[#2a181d]">
                Supprimer le produit
              </h3>
            </div>
            <p className="text-sm text-[#94786b] mb-2">
              Vous êtes sur le point de supprimer{" "}
              <strong className="text-[#2a181d]">{product?.name}</strong>.
            </p>
            <p className="text-sm text-[#94786b] mb-6">
              Cette action est irréversible et supprimera également toutes les
              images et lots associés.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
                className="h-10 px-4 text-sm text-[#2a181d] hover:bg-[#faf6f1] transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-10 px-4 bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isDeleting && <Loader2 size={14} className="animate-spin" />}
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
