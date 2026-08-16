import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getCategories } from '@/features/admin/categories/actions';
import { CategoriesClient } from '@/features/admin/categories/CategoriesClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Catégories | Admin SO\'MAYA',
};

async function CategoriesData() {
  const categories = await getCategories();
  return <CategoriesClient categories={categories} />;
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-4" style={{ maxWidth: 600 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[#faf6f1] border border-[#511F29]/10 animate-pulse"
            style={{ padding: '16px 20px', height: 80 }}
          />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square bg-[#faf6f1] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#2a181d] mb-1">
            Catégories
          </h1>
          <p className="text-sm text-[#94786b]">
            Gérez les catégories de votre catalogue
          </p>
        </div>
        <Link
          href="/admin/categories/nouveau"
          className="inline-flex items-center gap-2 h-11 px-6 bg-[#511F29] text-[#fcd3b4] text-sm font-semibold transition-colors hover:bg-[#3d171f]"
        >
          <Plus size={18} />
          Nouvelle catégorie
        </Link>
      </div>

      {/* Content */}
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesData />
      </Suspense>
    </div>
  );
}
