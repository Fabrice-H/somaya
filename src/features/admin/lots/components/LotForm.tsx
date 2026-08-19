"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Upload,
  X,
  Loader2,
  Package,
  Settings2,
  AlertTriangle,
  GripVertical,
} from "lucide-react";
import { createPriceLot, updatePriceLot, deletePriceLot } from "../actions";
import { uploadToCloudinaryDirect } from "@/lib/cloudinary/direct-upload";
import imageCompression from "browser-image-compression";
import type { PriceLot, PriceLotItem, PriceLotInput } from "../types";

interface LotFormProps {
  lot?: PriceLot | null;
  categories: Array<{ id: string; name: string; slug: string }>;
}

type TabKey = "articles" | "settings";

export function LotForm({ lot, categories }: LotFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("articles");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [name, setName] = useState(lot?.name || "");
  const [price, setPrice] = useState(lot?.price || 0);
  const [categoryId, setCategoryId] = useState(lot?.category_id || "");
  const [isActive, setIsActive] = useState(lot?.is_active ?? true);
  const [items, setItems] = useState<PriceLotItem[]>(lot?.items || []);

  // Upload state per item
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const isEditMode = !!lot;
  const isDirty = true; // Simplified - always consider dirty for now

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "articles", label: "Articles", icon: <Package size={16} /> },
    { key: "settings", label: "Options", icon: <Settings2 size={16} /> },
  ];

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `temp-${Date.now()}`,
        image: "",
        stock: 1,
        label: "",
      },
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleUpdateItem = (idx: number, updates: Partial<PriceLotItem>) => {
    setItems(items.map((item, i) => (i === idx ? { ...item, ...updates } : item)));
  };

  const handleImageUpload = async (idx: number, file: File) => {
    setUploadingIdx(idx);
    setError(null);
    try {
      // Compress image if needed
      let fileToUpload = file;
      if (file.size > 500 * 1024) {
        try {
          const compressed = await imageCompression(file, {
            maxSizeMB: 2,
            maxWidthOrHeight: 2400,
            useWebWorker: true,
            initialQuality: 0.9,
            preserveExif: false,
          });
          fileToUpload = new File([compressed], file.name, { type: compressed.type });
        } catch {
          // Use original if compression fails
        }
      }

      // Upload directly to Cloudinary
      const result = await uploadToCloudinaryDirect(fileToUpload, "somaya/lots");
      if (result.success && result.url) {
        handleUpdateItem(idx, { image: result.url });
      } else {
        setError(result.error || "Erreur lors de l'upload");
      }
    } catch (err) {
      setError("Erreur lors de l'upload de l'image");
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError("Le nom est requis");
      return;
    }
    if (price <= 0) {
      setError("Le prix doit être supérieur à 0");
      return;
    }
    if (items.length === 0) {
      setError("Ajoutez au moins un article");
      return;
    }
    if (items.some((item) => !item.image)) {
      setError("Tous les articles doivent avoir une image");
      return;
    }

    const input: PriceLotInput = {
      name: name.trim(),
      price,
      category_id: categoryId || null,
      items: items.map((item, idx) => ({
        ...item,
        id: item.id.startsWith("temp-") ? `item-${Date.now()}-${idx}` : item.id,
      })),
      is_active: isActive,
    };

    startTransition(async () => {
      let result;
      if (lot) {
        result = await updatePriceLot(lot.id, input);
      } else {
        result = await createPriceLot(input);
      }

      if (result.success) {
        router.push("/admin/lots");
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    });
  };

  const handleDelete = async () => {
    if (!lot) return;

    setIsDeleting(true);
    try {
      const result = await deletePriceLot(lot.id);
      if (!result.success) {
        alert(result.error || "Erreur lors de la suppression");
        return;
      }
      router.push("/admin/lots");
      router.refresh();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Une erreur est survenue");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

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
              {isEditMode ? "Modifier le lot" : "Nouveau lot de prix"}
            </h1>
            {name && (
              <p className="text-sm text-[#94786b] mt-0.5">{name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
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
            disabled={isPending || !name}
            className="inline-flex items-center gap-2 h-11 px-6 bg-[#511F29] text-[#fcd3b4] text-sm font-semibold transition-colors hover:bg-[#3d171f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isPending ? "Enregistrement..." : "Enregistrer"}
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
          className="p-4 bg-red-50 border border-red-200 text-red-700"
          style={{ margin: "24px 40px 0" }}
        >
          {error}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "32px 40px" }}>
        {activeTab === "articles" && (
          <div style={{ maxWidth: 1000 }}>
            {/* Basic Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="text-lg font-medium text-[#511F29] mb-4">Informations du lot</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-[#94786b] mb-1.5">
                    Nom du lot *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Chaînes 10k"
                    className="w-full h-11 px-4 border border-[#511F29]/20 focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 text-[#2a181d]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#94786b] mb-1.5">
                    Prix (FCFA) *
                  </label>
                  <input
                    type="number"
                    value={price || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPrice(val === "" ? 0 : Number(val) || 0);
                    }}
                    placeholder="10000"
                    min="0"
                    className="w-full h-11 px-4 border border-[#511F29]/20 focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 text-[#2a181d]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#94786b] mb-1.5">
                    Catégorie
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-11 px-4 border border-[#511F29]/20 focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 bg-white text-[#2a181d]"
                  >
                    <option value="">Sans catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-[#511F29]">
                  Articles ({items.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-2 h-9 px-4 bg-[#faf6f1] text-[#511F29] text-sm font-medium hover:bg-[#f0e8e0] transition-colors"
                >
                  <Plus size={16} />
                  Ajouter un article
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-[#511F29]/20">
                  <Package size={48} className="mx-auto text-[#511F29]/20 mb-4" />
                  <p className="text-[#94786b] mb-4">Aucun article dans ce lot</p>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-2 h-10 px-5 bg-[#511F29] text-[#fcd3b4] text-sm font-medium hover:bg-[#3d171f] transition-colors"
                  >
                    <Plus size={16} />
                    Ajouter le premier article
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((item, idx) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      index={idx}
                      isUploading={uploadingIdx === idx}
                      onUpdate={(updates) => handleUpdateItem(idx, updates)}
                      onRemove={() => handleRemoveItem(idx)}
                      onUpload={(file) => handleImageUpload(idx, file)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div style={{ maxWidth: 600 }}>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-[#511F29] mb-4">Options</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 rounded border-[#511F29]/30 text-[#511F29] focus:ring-[#511F29]/20"
                />
                <div>
                  <span className="text-sm font-medium text-[#2a181d]">
                    Lot actif
                  </span>
                  <p className="text-xs text-[#94786b]">
                    Le lot sera visible sur le site
                  </p>
                </div>
              </label>
            </div>
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
                Supprimer le lot
              </h3>
            </div>
            <p className="text-sm text-[#94786b] mb-2">
              Vous êtes sur le point de supprimer{" "}
              <strong className="text-[#2a181d]">{lot?.name}</strong>.
            </p>
            <p className="text-sm text-[#94786b] mb-6">
              Cette action est irréversible et supprimera également toutes les
              images associées.
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

// Item Card Component
interface ItemCardProps {
  item: PriceLotItem;
  index: number;
  isUploading: boolean;
  onUpdate: (updates: Partial<PriceLotItem>) => void;
  onRemove: () => void;
  onUpload: (file: File) => void;
}

function ItemCard({
  item,
  index,
  isUploading,
  onUpdate,
  onRemove,
  onUpload,
}: ItemCardProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="border border-[#511F29]/10 overflow-hidden bg-[#faf6f1]">
      {/* Image */}
      <div className="relative aspect-square bg-white">
        {item.image ? (
          <>
            <Image
              src={item.image}
              alt={item.label || `Article ${index + 1}`}
              fill
              className="object-cover"
              sizes="200px"
            />
            <button
              type="button"
              onClick={() => onUpdate({ image: "" })}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-[#f5f0eb] transition-colors">
            {isUploading ? (
              <Loader2 size={32} className="text-[#511F29]/30 animate-spin" />
            ) : (
              <>
                <Upload size={32} className="text-[#511F29]/30 mb-2" />
                <span className="text-sm text-[#94786b]">Ajouter image</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Fields */}
      <div className="p-3 space-y-2">
        <input
          type="text"
          value={item.label || ""}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Label (optionnel)"
          className="w-full h-9 px-3 border border-[#511F29]/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 bg-white text-[#2a181d]"
        />
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="number"
              value={item.stock || ""}
              onChange={(e) => {
                const val = e.target.value;
                onUpdate({ stock: val === "" ? 0 : Number(val) || 0 });
              }}
              min="0"
              placeholder="Stock"
              className="w-full h-9 px-3 border border-[#511F29]/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 bg-white text-[#2a181d]"
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
