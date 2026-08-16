"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Trash2, GripVertical, Save, X, ExternalLink, Eye, EyeOff } from "lucide-react";

// Custom Instagram icon since lucide-react doesn't have one
function InstagramIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
import {
  createInstagramPost,
  updateInstagramPost,
  deleteInstagramPost,
  type InstagramPostData,
  type InstagramSettings,
} from "./actions";
import { ImageUpload } from "../components/ImageUpload";
import clsx from "clsx";

interface InstagramManagerProps {
  initialData: InstagramPostData[];
  settings: InstagramSettings;
  embedded?: boolean;
}

export function InstagramManager({ initialData, settings, embedded = false }: InstagramManagerProps) {
  const [posts, setPosts] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    image: "",
    postUrl: "",
    isActive: true,
  });

  const resetForm = () => {
    setForm({
      image: "",
      postUrl: "",
      isActive: true,
    });
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!form.image) return;

    startTransition(async () => {
      const sortOrder = posts.length;
      const result = await createInstagramPost({
        image: form.image,
        postUrl: form.postUrl || null,
        isActive: form.isActive,
        sortOrder,
      });

      if (result.success && result.id) {
        setPosts((prev) => [
          ...prev,
          { id: result.id!, ...form, postUrl: form.postUrl || null, sortOrder },
        ]);
        setMessage({ type: "success", text: "Publication ajoutée" });
        resetForm();
      } else {
        setMessage({ type: "error", text: result.error || "Erreur" });
      }
      setTimeout(() => setMessage(null), 3000);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Supprimer cette publication ?")) return;

    startTransition(async () => {
      const result = await deleteInstagramPost(id);
      if (result.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        setMessage({ type: "success", text: "Publication supprimée" });
      } else {
        setMessage({ type: "error", text: result.error || "Erreur" });
      }
      setTimeout(() => setMessage(null), 3000);
    });
  };

  const handleToggleActive = (item: InstagramPostData) => {
    startTransition(async () => {
      const result = await updateInstagramPost(item.id, { isActive: !item.isActive });
      if (result.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, isActive: !p.isActive } : p))
        );
      }
    });
  };

  return (
    <div>
      {/* Header */}
      <div
        className={clsx(
          "flex items-center justify-between gap-4",
          embedded ? "p-4 border-b border-[#511F29]/10" : "bg-[#faf6f1] border-b border-[#511F29]/10"
        )}
        style={embedded ? {} : { padding: "24px 40px" }}
      >
        <div className="flex items-center gap-3">
          {!embedded && (
            <div className="w-10 h-10 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white flex items-center justify-center rounded-lg">
              <InstagramIcon size={20} />
            </div>
          )}
          <div>
            <h2 className={clsx(embedded ? "text-lg" : "text-xl", "font-semibold text-[#2a181d]")}>
              {embedded ? "Gérer les publications" : "Instagram"}
            </h2>
            <p className="text-sm text-[#6e5a50]">
              Publications affichées sur la page d&apos;accueil
              <a
                href={settings.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-[#511F29] hover:underline inline-flex items-center gap-1"
              >
                @{settings.username}
                <ExternalLink size={12} />
              </a>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </span>
          )}
          <button
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#511F29] text-white text-sm font-medium rounded-lg
                     hover:bg-[#3d161f] transition-colors"
          >
            <Plus size={18} />
            Ajouter
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: embedded ? "16px" : "32px 40px" }}>
        <div className="grid lg:grid-cols-2 gap-6" style={{ maxWidth: 1200 }}>
          {/* Form Panel */}
          {isAdding && (
            <div className="bg-white p-6 rounded-lg border border-[#511F29]/10 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#2a181d]">Nouvelle publication</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2a181d] mb-2">Image</label>
                  <ImageUpload
                    images={form.image ? [form.image] : []}
                    onChange={(urls) => setForm({ ...form, image: urls[0] || "" })}
                    bucket="store"
                    maxImages={1}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2a181d] mb-1.5">
                    Lien vers le post (optionnel)
                  </label>
                  <input
                    type="url"
                    value={form.postUrl}
                    onChange={(e) => setForm({ ...form, postUrl: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20"
                    placeholder="https://www.instagram.com/p/..."
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-[#511F29] focus:ring-[#511F29]/20"
                  />
                  <span className="text-sm text-[#2a181d]">Visible sur le site</span>
                </label>

                <button
                  onClick={handleSave}
                  disabled={isPending || !form.image}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#511F29] text-white rounded-lg
                           hover:bg-[#3d161f] disabled:opacity-50 transition-colors"
                >
                  <Save size={18} />
                  {isPending ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          )}

          {/* Grid Panel */}
          <div className={clsx("space-y-3", !isAdding && "lg:col-span-2")}>
            {posts.length === 0 ? (
              <div className="bg-white p-12 rounded-lg border border-[#511F29]/10 text-center">
                <InstagramIcon size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Aucune publication</p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="mt-4 text-[#511F29] font-medium hover:underline"
                >
                  Ajouter la premiere
                </button>
              </div>
            ) : (
              <div className={clsx("grid gap-4", !isAdding ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" : "grid-cols-2 sm:grid-cols-3")}>
                {posts.map((item) => (
                  <div
                    key={item.id}
                    className={clsx(
                      "group relative bg-white rounded-lg overflow-hidden border transition-all",
                      item.isActive ? "border-[#511F29]/10" : "border-gray-200 opacity-60"
                    )}
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={item.image}
                        alt="Instagram post"
                        fill
                        className="object-cover"
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleActive(item)}
                          className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                          title={item.isActive ? "Masquer" : "Afficher"}
                        >
                          {item.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        {item.postUrl && (
                          <a
                            href={item.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                            title="Voir sur Instagram"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Drag handle */}
                      <div className="absolute top-2 left-2 cursor-move text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical size={16} />
                      </div>

                      {/* Status badge */}
                      {!item.isActive && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-gray-800/80 text-white text-xs rounded">
                          Masqué
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
