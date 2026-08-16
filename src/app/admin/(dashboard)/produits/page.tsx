import { Suspense } from 'react';
import { Package } from 'lucide-react';
import { getProducts } from '@/features/admin/products/actions';
import { getCategories } from '@/features/admin/categories/actions';
import { ProductsClient } from '@/features/admin/products';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Produits | Admin SO'MAYA",
};

async function ProductsData() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <ProductsClient products={products} categories={categories} />;
}

function ProductsSkeleton() {
  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <div className="h-8 w-32 bg-[#faf6f1] animate-pulse mb-2" />
          <div className="h-4 w-48 bg-[#faf6f1] animate-pulse" />
        </div>
        <div className="h-11 w-40 bg-[#faf6f1] animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8" style={{ maxWidth: 800 }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#faf6f1] border border-[#511F29]/10 animate-pulse"
            style={{ height: 80 }}
          />
        ))}
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-[200px] max-w-md h-11 bg-[#faf6f1] animate-pulse" />
        <div className="h-11 w-48 bg-[#faf6f1] animate-pulse" />
        <div className="h-11 w-40 bg-[#faf6f1] animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-[#faf6f1] animate-pulse">
            <div className="aspect-square bg-[#e8e0d8]" />
            <div className="p-3">
              <div className="h-4 w-3/4 bg-[#e8e0d8] mb-2" />
              <div className="h-3 w-1/2 bg-[#e8e0d8] mb-2" />
              <div className="h-4 w-2/3 bg-[#e8e0d8]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsData />
    </Suspense>
  );
}
