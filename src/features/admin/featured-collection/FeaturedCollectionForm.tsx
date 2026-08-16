"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Check, X, Star } from "lucide-react";
import { ImageUpload } from "../components/ImageUpload";
import {
  type FeaturedCollectionData,
  type FeaturedCollectionInput,
  updateFeaturedCollection,
} from "./actions";
import type { Category } from "@/lib/db/schema";

interface FeaturedCollectionFormProps {
  data: FeaturedCollectionData | null;
  categories: { id: string; name: string }[];
}

export function FeaturedCollectionForm({
  data,
  categories,
}: FeaturedCollectionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [form, setForm] = useState<FeaturedCollectionInput>({
    eyebrow: data?.eyebrow || "La nouvelle saison",
    title: data?.title || "Collection Cérémonie 2026",
    description: data?.description || "",
    stat1_value: data?.stat1_value || "48",
    stat1_label: data?.stat1_label || "Nouvelles pièces",
    stat2_value: data?.stat2_value || "100%",
    stat2_label: data?.stat2_label || "Fait main",
    button_text: data?.button_text || "Voir la collection",
    button_link: data?.button_link || "/catalogue",
    images: data?.images || [],
    category_id: data?.category_id || null,
    is_active: data?.is_active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateFeaturedCollection(form);
      if (result.success) {
        setMessage({ type: "success", text: "Collection vedette mise à jour" });
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.error || "Erreur" });
      }
    });
  };

  const updateField = <K extends keyof FeaturedCollectionInput>(
    key: K,
    value: FeaturedCollectionInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Styles
  const inputClass =
    "w-full h-12 px-4 bg-[#faf6f1] border border-[#511F29]/15 text-[#2a181d] text-sm outline-none transition-colors focus:border-[#511F29]/40";
  const labelClass = "block text-sm font-medium text-[#2a181d] mb-2";
  const hintClass = "text-xs text-[#94786b] mt-1.5";

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div
        className="flex items-center justify-between gap-4 flex-wrap bg-[#faf6f1] border-b border-[#511F29]/10"
        style={{ padding: "24px 40px" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-[#511F29] text-[#fcd3b4]">
            <Star size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#2a181d]">
              Collection Vedette
            </h1>
            <p className="text-sm text-[#94786b] mt-0.5">
              Section mise en avant sur la page d'accueil
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Active toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-[#2a181d]">
              {form.is_active ? "Active" : "Inactive"}
            </span>
            <button
              type="button"
              onClick={() => updateField("is_active", !form.is_active)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                form.is_active ? "bg-green-500" : "bg-[#94786b]"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  form.is_active ? "left-7" : "left-1"
                }`}
              />
            </button>
          </label>

          <button
            type="submit"
            disabled={isPending}
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

      {/* Message */}
      {message && (
        <div
          className="mx-10 mt-6"
          style={{
            padding: 16,
            background:
              message.type === "success"
                ? "rgba(34, 197, 94, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
            border: `1px solid ${
              message.type === "success"
                ? "rgba(34, 197, 94, 0.3)"
                : "rgba(239, 68, 68, 0.3)"
            }`,
            color: message.type === "success" ? "#15803d" : "#dc2626",
          }}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <Check size={16} /> : <X size={16} />}
            {message.text}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "32px 40px" }}>
        <div className="grid lg:grid-cols-2 gap-8" style={{ maxWidth: 1200 }}>
          {/* Left Column - Text content */}
          <div className="space-y-6">
            <div
              className="bg-white"
              style={{
                border: "1px solid rgba(81, 31, 41, 0.1)",
                padding: 24,
              }}
            >
              <h2 className="text-base font-semibold text-[#2a181d] mb-4">
                Contenu textuel
              </h2>

              <div className="space-y-5">
                {/* Eyebrow */}
                <div>
                  <label className={labelClass}>Surtitre</label>
                  <input
                    type="text"
                    value={form.eyebrow || ""}
                    onChange={(e) => updateField("eyebrow", e.target.value)}
                    placeholder="La nouvelle saison"
                    className={inputClass}
                  />
                  <p className={hintClass}>
                    Petit texte au-dessus du titre principal
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className={labelClass}>Titre principal *</label>
                  <input
                    type="text"
                    value={form.title || ""}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Collection Cérémonie 2026"
                    className={inputClass}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={form.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={3}
                    placeholder="Décrivez cette collection..."
                    className={`${inputClass} h-auto py-3 resize-none`}
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Stat 1 - Valeur</label>
                    <input
                      type="text"
                      value={form.stat1_value || ""}
                      onChange={(e) =>
                        updateField("stat1_value", e.target.value)
                      }
                      placeholder="48"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Stat 1 - Label</label>
                    <input
                      type="text"
                      value={form.stat1_label || ""}
                      onChange={(e) =>
                        updateField("stat1_label", e.target.value)
                      }
                      placeholder="Nouvelles pièces"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Stat 2 - Valeur</label>
                    <input
                      type="text"
                      value={form.stat2_value || ""}
                      onChange={(e) =>
                        updateField("stat2_value", e.target.value)
                      }
                      placeholder="100%"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Stat 2 - Label</label>
                    <input
                      type="text"
                      value={form.stat2_label || ""}
                      onChange={(e) =>
                        updateField("stat2_label", e.target.value)
                      }
                      placeholder="Fait main"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Button & Link */}
            <div
              className="bg-white"
              style={{
                border: "1px solid rgba(81, 31, 41, 0.1)",
                padding: 24,
              }}
            >
              <h2 className="text-base font-semibold text-[#2a181d] mb-4">
                Bouton d'action
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Texte du bouton</label>
                    <input
                      type="text"
                      value={form.button_text || ""}
                      onChange={(e) =>
                        updateField("button_text", e.target.value)
                      }
                      placeholder="Voir la collection"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Lien du bouton</label>
                    <input
                      type="text"
                      value={form.button_link || ""}
                      onChange={(e) =>
                        updateField("button_link", e.target.value)
                      }
                      placeholder="/catalogue"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Category link */}
                <div>
                  <label className={labelClass}>
                    Lier à une catégorie (optionnel)
                  </label>
                  <select
                    value={form.category_id || ""}
                    onChange={(e) =>
                      updateField("category_id", e.target.value || null)
                    }
                    className={inputClass}
                  >
                    <option value="">Aucune catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className={hintClass}>
                    Si sélectionné, le bouton mènera vers cette catégorie
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Images */}
          <div>
            <div
              className="bg-white"
              style={{
                border: "1px solid rgba(81, 31, 41, 0.1)",
                padding: 24,
              }}
            >
              <h2 className="text-base font-semibold text-[#2a181d] mb-4">
                Images de la section
              </h2>
              <p className="text-sm text-[#94786b] mb-4">
                Uploadez 3 images pour la grille : 1 grande image verticale + 2
                petites images carrées
              </p>

              <ImageUpload
                images={form.images}
                onChange={(urls) => updateField("images", urls)}
                bucket="featured"
                maxImages={3}
              />

              <p className={hintClass} style={{ marginTop: 12 }}>
                Format recommandé : 800x1000px pour la grande image, 400x400px
                pour les petites
              </p>
            </div>

            {/* Preview */}
            <div
              className="mt-6 bg-white"
              style={{
                border: "1px solid rgba(81, 31, 41, 0.1)",
                padding: 24,
              }}
            >
              <h2 className="text-base font-semibold text-[#2a181d] mb-4">
                Aperçu
              </h2>
              <div
                style={{
                  background: "#511F29",
                  padding: 20,
                  borderRadius: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#fcd3b4",
                    marginBottom: 8,
                  }}
                >
                  {form.eyebrow || "La nouvelle saison"}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-serif), serif",
                    fontSize: 20,
                    color: "#fbf3ec",
                    marginBottom: 8,
                  }}
                >
                  {form.title || "Collection Cérémonie 2026"}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(251,243,236,0.7)",
                    marginBottom: 12,
                    lineHeight: 1.5,
                  }}
                >
                  {form.description?.slice(0, 100) || "Description..."}
                  {(form.description?.length || 0) > 100 ? "..." : ""}
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                  <div>
                    <div
                      style={{
                        fontSize: 18,
                        color: "#fcd3b4",
                        fontWeight: 500,
                      }}
                    >
                      {form.stat1_value || "48"}
                    </div>
                    <div style={{ fontSize: 9, color: "rgba(251,243,236,0.6)" }}>
                      {form.stat1_label || "Nouvelles pièces"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 18,
                        color: "#fcd3b4",
                        fontWeight: 500,
                      }}
                    >
                      {form.stat2_value || "100%"}
                    </div>
                    <div style={{ fontSize: 9, color: "rgba(251,243,236,0.6)" }}>
                      {form.stat2_label || "Fait main"}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    display: "inline-block",
                    background: "#fcd3b4",
                    color: "#511F29",
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "8px 16px",
                  }}
                >
                  {form.button_text || "Voir la collection"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
