'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, FolderOpen, Loader2 } from 'lucide-react';
import { deleteCategory, type Category } from '@/features/categories/server/actions';

type CategoriesClientProps = {
  categories: Category[];
};

export function CategoriesClient({ categories }: CategoriesClientProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    const result = await deleteCategory(deleteTarget.id);

    if (result.success) {
      setDeleteTarget(null);
      router.refresh();
    } else {
      alert(result.error || 'Erreur lors de la suppression');
    }
    setLoading(false);
  };

  // Stats
  const totalCategories = categories.length;
  const withImages = categories.filter((c) => c.image_url).length;
  const activeCategories = categories.filter((c) => c.is_active).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4" style={{ maxWidth: 600 }}>
        {[
          { label: 'Total', value: totalCategories, color: '#3c161e' },
          { label: 'Avec image', value: withImages, color: '#A08050' },
          { label: 'Actives', value: activeCategories, color: '#16a34a' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#fafafa] border border-[#511f29]/10"
            style={{ padding: '16px 20px' }}
          >
            <p className="text-xs text-[#6b6b6b] mb-1 uppercase tracking-wide">
              {stat.label}
            </p>
            <p
              className="text-3xl font-semibold tabular-nums"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div
          className="text-center bg-[#fafafa] border border-[#511f29]/10"
          style={{ padding: '64px 24px' }}
        >
          <FolderOpen
            size={48}
            className="text-[#6b6b6b] mx-auto mb-4"
          />
          <p className="text-base font-medium text-[#000000] mb-1">
            Aucune catégorie
          </p>
          <p className="text-sm text-[#6b6b6b]">
            Créez votre première catégorie pour organiser vos produits
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-px"
          style={{ background: 'rgba(81,31,41,0.1)' }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative bg-[#fafafa]"
            >
              {/* Image */}
              <Link
                href={`/admin/categories/${category.id}`}
                className="block relative aspect-square overflow-hidden"
              >
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#f4f4f2]">
                    <FolderOpen size={32} className="text-[#6b6b6b]" />
                  </div>
                )}

                {/* Position badge */}
                <div className="absolute top-2 left-2">
                  <span
                    className="tabular-nums px-2 py-1 text-[10px] font-semibold"
                    style={{
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                    }}
                  >
                    #{category.position}
                  </span>
                </div>

                {/* Active/Inactive badge */}
                {!category.is_active && (
                  <div className="absolute top-2 right-2">
                    <span
                      className="px-2 py-1 text-[10px] font-semibold uppercase"
                      style={{
                        background: '#ef4444',
                        color: 'white',
                      }}
                    >
                      Inactive
                    </span>
                  </div>
                )}

                {/* Edit overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(81,31,41,0.5)' }}
                >
                  <span
                    className="px-4 py-2.5 bg-white text-[#000000] text-xs font-semibold tracking-wide"
                  >
                    <Pencil size={14} className="inline mr-2" style={{ verticalAlign: 'middle' }} />
                    Modifier
                  </span>
                </div>
              </Link>

              {/* Info */}
              <div style={{ padding: '12px 14px 14px' }}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[#000000] mb-0.5 truncate">
                      {category.name}
                    </h3>
                    <p className="text-xs text-[#6b6b6b] truncate">
                      /{category.slug}
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteTarget(category)}
                    className="w-7 h-7 inline-flex items-center justify-center text-[#6b6b6b] hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !loading && setDeleteTarget(null)}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-[#000000] mb-2">
              Supprimer la catégorie ?
            </h3>
            <p className="text-sm text-[#4a4a4a] mb-6 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer &quot;{deleteTarget.name}&quot; ?
              Les produits associés ne seront pas supprimés mais perdront leur catégorie.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium border border-[#511f29]/20 text-[#000000] hover:bg-[#fafafa] transition-colors rounded"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors rounded flex items-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
