'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { createCategory, updateCategory, type Category, type CategoryInput } from './actions';

type CategoryFormProps = {
  category?: Category;
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [form, setForm] = useState<CategoryInput>({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image_url: category?.image_url || null,
    position: category?.position || 0,
    is_active: category?.is_active ?? true,
  });

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: category ? prev.slug : generateSlug(name),
    }));
    setIsDirty(true);
  };

  const handleChange = (updates: Partial<CategoryInput>) => {
    setForm((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const result = category
          ? await updateCategory(category.id, form)
          : await createCategory({ ...form, position: form.position || 0 });

        if (!result.success) {
          alert(result.error || 'Une erreur est survenue');
          return;
        }

        router.push('/admin/categories');
        router.refresh();
      } catch (error) {
        console.error('Form error:', error);
        alert('Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    },
    [category, form, router]
  );

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div
        className="flex items-center justify-between gap-4 flex-wrap bg-[#faf6f1] border-b border-[#511F29]/10"
        style={{ padding: '24px 40px' }}
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
              {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
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
          <button
            type="submit"
            disabled={loading || !form.name || !form.slug}
            className="inline-flex items-center gap-2 h-11 px-6 bg-[#511F29] text-[#fcd3b4] text-sm font-semibold transition-colors hover:bg-[#3d171f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 40px' }}>
        <div className="grid lg:grid-cols-2 gap-8" style={{ maxWidth: 1000 }}>
          {/* Left column - Form fields */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#2a181d] mb-2"
              >
                Nom de la catégorie *
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Sacs à main"
                className="w-full h-12 px-4 bg-[#faf6f1] border border-[#511F29]/15 text-[#2a181d] text-sm outline-none transition-colors focus:border-[#511F29]/40"
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-[#2a181d] mb-2"
              >
                Slug (URL) *
              </label>
              <input
                id="slug"
                type="text"
                value={form.slug}
                onChange={(e) => handleChange({ slug: e.target.value })}
                placeholder="sacs-a-main"
                className="w-full h-12 px-4 bg-[#faf6f1] border border-[#511F29]/15 text-[#2a181d] text-sm font-mono outline-none transition-colors focus:border-[#511F29]/40"
              />
              <p className="text-xs text-[#94786b] mt-1">
                URL: /catalogue/{form.slug || 'nom-categorie'}
              </p>
            </div>

            {/* Position */}
            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-[#2a181d] mb-2"
              >
                Position d&apos;affichage
              </label>
              <input
                id="position"
                type="number"
                value={form.position || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handleChange({ position: val === "" ? 0 : parseInt(val) || 0 });
                }}
                min={0}
                placeholder="0"
                className="w-32 h-12 px-4 bg-[#faf6f1] border border-[#511F29]/15 text-[#2a181d] text-sm outline-none transition-colors focus:border-[#511F29]/40"
              />
              <p className="text-xs text-[#94786b] mt-1">
                Les catégories avec un numéro plus petit s&apos;affichent en premier
              </p>
            </div>

            {/* Description */}
            <RichTextEditor
              value={form.description || ''}
              onChange={(value) => handleChange({ description: value && value !== '<p></p>' ? value : null })}
              label="Description"
              placeholder="Décrivez cette catégorie..."
              hint="Utilisez les outils de mise en forme pour structurer votre texte"
              minHeight={180}
            />

            {/* Active toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleChange({ is_active: !form.is_active })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  form.is_active ? 'bg-green-500' : 'bg-[#94786b]'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    form.is_active ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
              <span className="text-sm text-[#2a181d]">
                {form.is_active ? 'Catégorie active' : 'Catégorie inactive'}
              </span>
            </div>
          </div>

          {/* Right column - Image */}
          <div>
            <label className="block text-sm font-medium text-[#2a181d] mb-2">
              Image de la catégorie
            </label>
            <ImageUpload
              images={form.image_url ? [form.image_url] : []}
              onChange={(urls) => {
                handleChange({ image_url: urls[0] || null });
              }}
              bucket="categories"
              maxImages={1}
            />
            <p className="text-xs text-[#94786b] mt-2">
              Format recommandé: carré, min 800x800px
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
