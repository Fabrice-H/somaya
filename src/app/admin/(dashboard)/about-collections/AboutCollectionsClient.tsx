"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Save, Loader2, Check, X, Users, Eye, EyeOff } from "lucide-react";
import {
  AboutCollectionData,
  createAboutCollection,
  updateAboutCollection,
  deleteAboutCollection,
  reorderAboutCollections,
} from "@/features/admin/about-collections/actions";

interface Props {
  initialCollections: AboutCollectionData[];
}

const DEFAULT_COLORS = [
  { label: "Bordeaux", value: "#511F29" },
  { label: "Bordeaux foncé", value: "#2a181d" },
  { label: "Brun", value: "#3c2a20" },
  { label: "Noir", value: "#1a1a1a" },
  { label: "Gris foncé", value: "#2d2d2d" },
];

export function AboutCollectionsClient({ initialCollections }: Props) {
  const [collections, setCollections] = useState<AboutCollectionData[]>(initialCollections);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [newCollection, setNewCollection] = useState({
    name: "",
    year: new Date().getFullYear().toString(),
    backgroundColor: "#511F29",
  });

  // Styles cohérents avec FeaturedCollectionForm
  const inputClass =
    "w-full h-12 px-4 bg-[#faf6f1] border border-[#511F29]/15 text-[#2a181d] text-sm outline-none transition-colors focus:border-[#511F29]/40";
  const labelClass = "block text-sm font-medium text-[#2a181d] mb-2";

  const handleAdd = async () => {
    if (!newCollection.name.trim()) return;

    setSaving("new");
    setMessage(null);

    startTransition(async () => {
      const result = await createAboutCollection({
        name: newCollection.name,
        year: newCollection.year,
        backgroundColor: newCollection.backgroundColor,
        isActive: true,
        sortOrder: collections.length,
      });

      if (result.success && result.id) {
        setCollections([
          ...collections,
          {
            id: result.id,
            name: newCollection.name,
            year: newCollection.year,
            backgroundColor: newCollection.backgroundColor,
            isActive: true,
            sortOrder: collections.length,
          },
        ]);
        setNewCollection({
          name: "",
          year: new Date().getFullYear().toString(),
          backgroundColor: "#511F29",
        });
        setIsAdding(false);
        setMessage({ type: "success", text: "Collection ajoutée avec succès" });
      } else {
        setMessage({ type: "error", text: result.error || "Erreur lors de l'ajout" });
      }
      setSaving(null);
    });
  };

  const handleUpdate = async (id: string, field: string, value: string | boolean) => {
    setSaving(id);
    setMessage(null);

    const result = await updateAboutCollection(id, { [field]: value });

    if (result.success) {
      setCollections(
        collections.map((c) => (c.id === id ? { ...c, [field]: value } : c))
      );
    } else {
      setMessage({ type: "error", text: result.error || "Erreur lors de la mise à jour" });
    }
    setSaving(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette collection ?")) return;

    setSaving(id);
    setMessage(null);

    const result = await deleteAboutCollection(id);

    if (result.success) {
      setCollections(collections.filter((c) => c.id !== id));
      setMessage({ type: "success", text: "Collection supprimée" });
    } else {
      setMessage({ type: "error", text: result.error || "Erreur lors de la suppression" });
    }
    setSaving(null);
  };

  const moveCollection = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= collections.length) return;

    const newCollections = [...collections];
    [newCollections[index], newCollections[newIndex]] = [
      newCollections[newIndex],
      newCollections[index],
    ];
    setCollections(newCollections);

    await reorderAboutCollections(newCollections.map((c) => c.id));
  };

  const activeCollections = collections.filter((c) => c.isActive);

  return (
    <div>
      {/* Header */}
      <div
        className="flex items-center justify-between gap-4 flex-wrap bg-[#faf6f1] border-b border-[#511F29]/10"
        style={{ padding: "24px 40px", margin: "-24px -24px 0 -24px" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-[#511F29] text-[#fcd3b4]">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#2a181d]">
              Collections À propos
            </h1>
            <p className="text-sm text-[#94786b] mt-0.5">
              Section affichée sur la page "Notre Histoire"
            </p>
          </div>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 h-11 px-6 bg-[#511F29] text-[#fcd3b4] text-sm font-semibold transition-colors hover:bg-[#3d171f]"
          >
            <Plus size={16} />
            Ajouter
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div
          style={{
            padding: 16,
            marginTop: 24,
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
          <div className="flex items-center gap-2 text-sm">
            {message.type === "success" ? <Check size={16} /> : <X size={16} />}
            {message.text}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "32px 0" }}>
        <div className="grid lg:grid-cols-2 gap-8" style={{ maxWidth: 1200 }}>
          {/* Left Column - Liste des collections */}
          <div className="space-y-6">
            {/* Formulaire d'ajout */}
            {isAdding && (
              <div
                className="bg-white"
                style={{
                  border: "1px solid rgba(81, 31, 41, 0.1)",
                  padding: 24,
                }}
              >
                <h2 className="text-base font-semibold text-[#2a181d] mb-4">
                  Nouvelle collection
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Nom de la collection *</label>
                    <input
                      type="text"
                      value={newCollection.name}
                      onChange={(e) =>
                        setNewCollection({ ...newCollection, name: e.target.value })
                      }
                      placeholder="Ex: Élégance"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Année</label>
                      <input
                        type="text"
                        value={newCollection.year}
                        onChange={(e) =>
                          setNewCollection({ ...newCollection, year: e.target.value })
                        }
                        placeholder="Ex: 2025"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Couleur de fond</label>
                      <select
                        value={newCollection.backgroundColor}
                        onChange={(e) =>
                          setNewCollection({ ...newCollection, backgroundColor: e.target.value })
                        }
                        className={inputClass}
                      >
                        {DEFAULT_COLORS.map((color) => (
                          <option key={color.value} value={color.value}>
                            {color.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-[#511F29]/10">
                  <button
                    onClick={handleAdd}
                    disabled={saving === "new" || !newCollection.name.trim()}
                    className="inline-flex items-center gap-2 h-11 px-6 bg-[#511F29] text-[#fcd3b4] text-sm font-semibold transition-colors hover:bg-[#3d171f] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving === "new" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {saving === "new" ? "Enregistrement..." : "Enregistrer"}
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="h-11 px-6 border border-[#511F29]/20 text-[#2a181d] text-sm font-medium hover:bg-[#faf6f1] transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Liste des collections */}
            <div
              className="bg-white"
              style={{
                border: "1px solid rgba(81, 31, 41, 0.1)",
                padding: 24,
              }}
            >
              <h2 className="text-base font-semibold text-[#2a181d] mb-4">
                Vos collections ({collections.length})
              </h2>

              {collections.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#faf6f1] flex items-center justify-center">
                    <Users size={24} className="text-[#94786b]" />
                  </div>
                  <p className="text-[#94786b] text-sm mb-4">
                    Aucune collection configurée
                  </p>
                  {!isAdding && (
                    <button
                      onClick={() => setIsAdding(true)}
                      className="inline-flex items-center gap-2 h-10 px-5 bg-[#511F29] text-[#fcd3b4] text-sm font-semibold transition-colors hover:bg-[#3d171f]"
                    >
                      <Plus size={14} />
                      Créer une collection
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {collections.map((collection, index) => (
                    <div
                      key={collection.id}
                      className="flex items-center gap-3 p-3 bg-[#faf6f1] border border-[#511F29]/10 transition-opacity"
                      style={{ opacity: saving === collection.id ? 0.6 : 1 }}
                    >
                      {/* Move buttons */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveCollection(index, "up")}
                          disabled={index === 0}
                          className="p-1 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Monter"
                        >
                          <ChevronUp size={14} className="text-[#94786b]" />
                        </button>
                        <button
                          onClick={() => moveCollection(index, "down")}
                          disabled={index === collections.length - 1}
                          className="p-1 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Descendre"
                        >
                          <ChevronDown size={14} className="text-[#94786b]" />
                        </button>
                      </div>

                      {/* Aperçu couleur */}
                      <div
                        className="w-10 h-12 flex-shrink-0"
                        style={{ backgroundColor: collection.backgroundColor }}
                      />

                      {/* Infos */}
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={collection.name}
                          onChange={(e) => handleUpdate(collection.id, "name", e.target.value)}
                          className="w-full h-9 px-3 bg-white border border-[#511F29]/10 text-[#2a181d] text-sm outline-none focus:border-[#511F29]/40"
                          placeholder="Nom"
                        />
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            value={collection.year}
                            onChange={(e) => handleUpdate(collection.id, "year", e.target.value)}
                            className="w-20 h-8 px-2 bg-white border border-[#511F29]/10 text-[#2a181d] text-xs outline-none focus:border-[#511F29]/40"
                            placeholder="Année"
                          />
                          <select
                            value={collection.backgroundColor}
                            onChange={(e) =>
                              handleUpdate(collection.id, "backgroundColor", e.target.value)
                            }
                            className="flex-1 h-8 px-2 bg-white border border-[#511F29]/10 text-[#2a181d] text-xs outline-none focus:border-[#511F29]/40"
                          >
                            {DEFAULT_COLORS.map((color) => (
                              <option key={color.value} value={color.value}>
                                {color.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Toggle actif */}
                      <button
                        onClick={() => handleUpdate(collection.id, "isActive", !collection.isActive)}
                        className={`p-2 transition-colors ${
                          collection.isActive
                            ? "text-green-600 hover:bg-green-50"
                            : "text-[#94786b] hover:bg-white"
                        }`}
                        title={collection.isActive ? "Visible" : "Masqué"}
                      >
                        {collection.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>

                      {/* Supprimer */}
                      <button
                        onClick={() => handleDelete(collection.id)}
                        className="p-2 text-red-500 hover:bg-red-50 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Aperçu */}
          <div>
            <div
              className="bg-white"
              style={{
                border: "1px solid rgba(81, 31, 41, 0.1)",
                padding: 24,
              }}
            >
              <h2 className="text-base font-semibold text-[#2a181d] mb-2">
                Aperçu
              </h2>
              <p className="text-sm text-[#94786b] mb-4">
                Rendu sur la page "Notre Histoire"
              </p>

              {activeCollections.length === 0 ? (
                <div className="text-center py-12 bg-[#faf6f1]">
                  <p className="text-[#94786b] text-sm">
                    Aucune collection active à afficher
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1">
                  {activeCollections.map((collection, index) => (
                    <div
                      key={collection.id}
                      className="relative aspect-[3/4] flex flex-col justify-end p-3 overflow-hidden"
                      style={{ backgroundColor: collection.backgroundColor }}
                    >
                      <span className="absolute top-2 right-2 text-white/40 text-[9px]">
                        {collection.year}
                      </span>
                      <span className="text-[8px] text-[#fcd3b4] tracking-widest uppercase mb-0.5">
                        Collection {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-white text-sm font-serif leading-tight">
                        {collection.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-[#94786b] mt-4">
                Les collections sont affichées dans l'ordre défini ci-contre.
                Utilisez les flèches pour réorganiser.
              </p>
            </div>

            {/* Infos */}
            <div
              className="mt-6 bg-[#faf6f1]"
              style={{
                border: "1px solid rgba(81, 31, 41, 0.1)",
                padding: 24,
              }}
            >
              <h3 className="text-sm font-semibold text-[#2a181d] mb-3">
                Comment ça marche ?
              </h3>
              <ul className="space-y-2 text-sm text-[#94786b]">
                <li className="flex gap-2">
                  <span className="text-[#511F29] font-semibold">1.</span>
                  Ajoutez vos collections avec un nom et une année
                </li>
                <li className="flex gap-2">
                  <span className="text-[#511F29] font-semibold">2.</span>
                  Choisissez une couleur de fond pour chaque collection
                </li>
                <li className="flex gap-2">
                  <span className="text-[#511F29] font-semibold">3.</span>
                  Utilisez l'icône œil pour masquer/afficher une collection
                </li>
                <li className="flex gap-2">
                  <span className="text-[#511F29] font-semibold">4.</span>
                  Réordonnez avec les flèches haut/bas
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
