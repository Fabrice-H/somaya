"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Edit, Trash2, Plus, GripVertical, Save, X, Loader2 } from "lucide-react";
import {
  type Category,
  type CategoryInput,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from "./actions";
import { ImageUpload } from "../components/ImageUpload";
import clsx from "clsx";

interface CategoryTableProps {
  categories: Category[];
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoryTable({ categories: initialCategories }: CategoryTableProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const [form, setForm] = useState<CategoryInput>({
    name: "",
    slug: "",
    description: "",
    image_url: null,
    position: 0,
    is_active: true,
  });

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      image_url: null,
      position: 0,
      is_active: true,
    });
  };

  const startEdit = (category: Category) => {
    setEditing(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image_url: category.image_url,
      position: category.position,
      is_active: category.is_active,
    });
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: editing ? prev.slug : generateSlug(name),
    }));
  };

  const handleSave = async () => {
    startTransition(async () => {
      if (editing) {
        const result = await updateCategory(editing, form);
        if (result.success) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editing ? { ...c, ...form } : c))
          );
          setEditing(null);
          resetForm();
        }
      } else if (creating) {
        const result = await createCategory({
          ...form,
          position: categories.length,
        });
        if (result.success && result.id) {
          setCategories((prev) => [
            ...prev,
            { id: result.id, ...form, created_at: new Date().toISOString() } as Category,
          ]);
          setCreating(false);
          resetForm();
        }
      }
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) return;

    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    });
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = categories.findIndex((c) => c.id === draggedId);
    const targetIndex = categories.findIndex((c) => c.id === targetId);

    const newCategories = [...categories];
    const [removed] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(targetIndex, 0, removed);

    setCategories(newCategories);
  };

  const handleDragEnd = () => {
    if (draggedId) {
      const orderedIds = categories.map((c) => c.id);
      reorderCategories(orderedIds);
    }
    setDraggedId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[#511F29]/60 text-sm">
          Glissez pour réordonner les catégories
        </p>
        {!creating && (
          <button
            onClick={() => {
              setCreating(true);
              resetForm();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#511F29] text-white
                     hover:bg-[#511F29]/90 transition-colors text-sm font-medium"
          >
            <Plus size={18} />
            Nouvelle categorie
          </button>
        )}
      </div>

      {/* Create form */}
      {creating && (
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-[#511F29]/20">
          <h3 className="text-lg font-medium text-[#511F29] mb-4">
            Nouvelle categorie
          </h3>
          <CategoryForm
            form={form}
            onNameChange={handleNameChange}
            onChange={setForm}
            onSave={handleSave}
            onCancel={() => {
              setCreating(false);
              resetForm();
            }}
            isPending={isPending}
          />
        </div>
      )}

      {/* Categories list */}
      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            draggable={!editing}
            onDragStart={() => handleDragStart(category.id)}
            onDragOver={(e) => handleDragOver(e, category.id)}
            onDragEnd={handleDragEnd}
            className={clsx(
              "bg-white rounded-xl shadow-sm overflow-hidden",
              draggedId === category.id && "opacity-50",
              editing === category.id && "ring-2 ring-[#511F29]"
            )}
          >
            {editing === category.id ? (
              <div className="p-6">
                <h3 className="text-lg font-medium text-[#511F29] mb-4">
                  Modifier: {category.name}
                </h3>
                <CategoryForm
                  form={form}
                  onNameChange={handleNameChange}
                  onChange={setForm}
                  onSave={handleSave}
                  onCancel={() => {
                    setEditing(null);
                    resetForm();
                  }}
                  isPending={isPending}
                />
              </div>
            ) : (
              <div className="p-4 flex items-center gap-4">
                <div className="cursor-move text-[#511F29]/30 hover:text-[#511F29]/50">
                  <GripVertical size={20} />
                </div>

                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[#511F29]/10 rounded-lg" />
                )}

                <div className="flex-1">
                  <p className="font-medium text-[#511F29]">{category.name}</p>
                  <p className="text-sm text-[#511F29]/60">
                    /{category.slug}
                    {category.description && ` • ${category.description}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(category)}
                    className="p-2 text-[#511F29]/50 hover:text-[#511F29] hover:bg-[#511F29]/5 rounded-lg"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && !creating && (
        <div className="bg-white rounded-xl p-8 text-center text-[#511F29]/50 shadow-sm">
          <p>Aucune catégorie</p>
          <p className="text-sm mt-1">Créez votre première catégorie</p>
        </div>
      )}
    </div>
  );
}

interface CategoryFormProps {
  form: CategoryInput;
  onNameChange: (name: string) => void;
  onChange: (form: CategoryInput) => void;
  onSave: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function CategoryForm({
  form,
  onNameChange,
  onChange,
  onSave,
  onCancel,
  isPending,
}: CategoryFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-[#511F29]/80 mb-1.5">
          Nom *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-[#511F29]/20
                   focus:outline-none focus:ring-2 focus:ring-[#511F29]/30"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#511F29]/80 mb-1.5">
          Slug *
        </label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => onChange({ ...form, slug: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-[#511F29]/20
                   focus:outline-none focus:ring-2 focus:ring-[#511F29]/30 font-mono text-sm"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-[#511F29]/80 mb-1.5">
          Description
        </label>
        <textarea
          value={form.description || ""}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          placeholder="Description de la catégorie..."
          rows={2}
          className="w-full px-4 py-2.5 rounded-lg border border-[#511F29]/20
                   focus:outline-none focus:ring-2 focus:ring-[#511F29]/30 resize-none"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-[#511F29]/80 mb-1.5">
          Image
        </label>
        <ImageUpload
          images={form.image_url ? [form.image_url] : []}
          onChange={(urls) => onChange({ ...form, image_url: urls[0] || null })}
          bucket="categories"
          maxImages={1}
        />
      </div>

      <div className="md:col-span-2 flex items-center gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 rounded-lg border border-[#511F29]/20 text-[#511F29]
                   hover:bg-[#511F29]/5 transition-colors flex items-center gap-2"
        >
          <X size={18} />
          Annuler
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isPending || !form.name || !form.slug}
          className="px-4 py-2 rounded-lg bg-[#511F29] text-white
                   hover:bg-[#511F29]/90 transition-colors flex items-center gap-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Enregistrer
        </button>
      </div>
    </div>
  );
}
