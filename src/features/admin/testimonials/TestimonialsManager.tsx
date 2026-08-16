"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Trash2, GripVertical, Star, Save, X, Edit2 } from "lucide-react";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
  type TestimonialData,
} from "./actions";
import { ImageUpload } from "../components/ImageUpload";
import clsx from "clsx";

interface TestimonialsManagerProps {
  initialData: TestimonialData[];
  embedded?: boolean;
}

export function TestimonialsManager({ initialData, embedded = false }: TestimonialsManagerProps) {
  const [testimonials, setTestimonials] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    image: "",
    text: "",
    rating: 5,
    isActive: true,
  });

  const resetForm = () => {
    setForm({
      name: "",
      location: "",
      image: "",
      text: "",
      rating: 5,
      isActive: true,
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (item: TestimonialData) => {
    setForm({
      name: item.name,
      location: item.location || "",
      image: item.image || "",
      text: item.text,
      rating: item.rating,
      isActive: item.isActive,
    });
    setEditingId(item.id);
    setIsAdding(false);
  };

  const handleSave = () => {
    startTransition(async () => {
      if (editingId) {
        const result = await updateTestimonial(editingId, form);
        if (result.success) {
          setTestimonials((prev) =>
            prev.map((t) => (t.id === editingId ? { ...t, ...form } : t))
          );
          setMessage({ type: "success", text: "Témoignage mis à jour" });
          resetForm();
        } else {
          setMessage({ type: "error", text: result.error || "Erreur" });
        }
      } else {
        const sortOrder = testimonials.length;
        const result = await createTestimonial({ ...form, sortOrder });
        if (result.success && result.id) {
          setTestimonials((prev) => [
            ...prev,
            { id: result.id!, ...form, sortOrder },
          ]);
          setMessage({ type: "success", text: "Témoignage ajouté" });
          resetForm();
        } else {
          setMessage({ type: "error", text: result.error || "Erreur" });
        }
      }
      setTimeout(() => setMessage(null), 3000);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Supprimer ce témoignage ?")) return;

    startTransition(async () => {
      const result = await deleteTestimonial(id);
      if (result.success) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        setMessage({ type: "success", text: "Témoignage supprimé" });
      } else {
        setMessage({ type: "error", text: result.error || "Erreur" });
      }
      setTimeout(() => setMessage(null), 3000);
    });
  };

  const handleToggleActive = (item: TestimonialData) => {
    startTransition(async () => {
      const result = await updateTestimonial(item.id, { isActive: !item.isActive });
      if (result.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === item.id ? { ...t, isActive: !t.isActive } : t))
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
            <div className="w-10 h-10 bg-[#511F29] text-white flex items-center justify-center rounded-lg">
              <Star size={20} />
            </div>
          )}
          <div>
            <h2 className={clsx(embedded ? "text-lg" : "text-xl", "font-semibold text-[#2a181d]")}>
              {embedded ? "Gérer les témoignages" : "Témoignages"}
            </h2>
            <p className="text-sm text-[#6e5a50]">Gérez les avis clients affichés sur la page d&apos;accueil</p>
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
          {(isAdding || editingId) && (
            <div className="bg-white p-6 rounded-lg border border-[#511F29]/10 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#2a181d]">
                  {editingId ? "Modifier le témoignage" : "Nouveau témoignage"}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2a181d] mb-1.5">Nom</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20"
                      placeholder="Aminata K."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2a181d] mb-1.5">Lieu</label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20"
                      placeholder="Cocody, Abidjan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2a181d] mb-1.5">Témoignage</label>
                  <textarea
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 resize-none"
                    placeholder="Le témoignage du client..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2a181d] mb-1.5">Note</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setForm({ ...form, rating: star })}
                        className={clsx(
                          "text-2xl transition-colors",
                          star <= form.rating ? "text-[#511F29]" : "text-gray-300"
                        )}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2a181d] mb-2">Photo</label>
                  <ImageUpload
                    images={form.image ? [form.image] : []}
                    onChange={(urls) => setForm({ ...form, image: urls[0] || "" })}
                    bucket="store"
                    maxImages={1}
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-[#511F29] focus:ring-[#511F29]/20"
                  />
                  <span className="text-sm text-[#2a181d]">Actif</span>
                </label>

                <button
                  onClick={handleSave}
                  disabled={isPending || !form.name || !form.text}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#511F29] text-white rounded-lg
                           hover:bg-[#3d161f] disabled:opacity-50 transition-colors"
                >
                  <Save size={18} />
                  {isPending ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          )}

          {/* List Panel */}
          <div className={clsx("space-y-3", !isAdding && !editingId && "lg:col-span-2")}>
            {testimonials.length === 0 ? (
              <div className="bg-white p-12 rounded-lg border border-[#511F29]/10 text-center">
                <Star size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Aucun témoignage</p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="mt-4 text-[#511F29] font-medium hover:underline"
                >
                  Ajouter le premier
                </button>
              </div>
            ) : (
              <div className={clsx("grid gap-4", !isAdding && !editingId && "md:grid-cols-2 lg:grid-cols-3")}>
                {testimonials.map((item) => (
                  <div
                    key={item.id}
                    className={clsx(
                      "bg-white p-4 rounded-lg border transition-all",
                      item.isActive ? "border-[#511F29]/10" : "border-gray-200 opacity-60"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="cursor-move text-gray-300 hover:text-gray-500 mt-1">
                        <GripVertical size={16} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                              {item.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-[#2a181d] text-sm">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.location}</div>
                          </div>
                        </div>

                        <div className="text-[#511F29] text-xs mb-2">
                          {"★".repeat(item.rating)}
                          {"★".repeat(5 - item.rating).split("").map((_, i) => (
                            <span key={i} className="text-gray-300">★</span>
                          ))}
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-3">{item.text}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={clsx(
                          "px-2 py-1 text-xs rounded",
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        )}
                      >
                        {item.isActive ? "Actif" : "Inactif"}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 text-gray-400 hover:text-[#511F29] hover:bg-[#511F29]/5 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
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
