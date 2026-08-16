import { Suspense } from 'react';
import { Package } from 'lucide-react';
import {
  getOrders,
  getOrdersStats,
  type OrderStatus,
} from '@/features/admin/orders/actions';
import { OrdersClient } from '@/features/admin/orders/OrdersClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Commandes | Admin SO'MAYA",
};

type SearchParams = Promise<{
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;
}>;

async function OrdersData({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const filterParams = {
    status: (params.status as OrderStatus | 'all') || 'all',
    search: params.search || '',
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    page: params.page ? parseInt(params.page, 10) : 1,
    limit: 10,
  };

  const [{ orders, total, page, totalPages }, stats] = await Promise.all([
    getOrders(filterParams),
    getOrdersStats(),
  ]);

  return (
    <OrdersClient
      orders={orders}
      stats={stats}
      total={total}
      page={page}
      totalPages={totalPages}
    />
  );
}

function OrdersSkeleton() {
  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-32 bg-[#faf6f1] animate-pulse mb-2" />
        <div className="h-4 w-48 bg-[#faf6f1] animate-pulse" />
      </div>

      {/* Status tabs skeleton */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="h-8 bg-[#faf6f1] animate-pulse"
            style={{ width: 80 + i * 10 }}
          />
        ))}
      </div>

      {/* Search bar skeleton */}
      <div
        className="flex flex-wrap items-center gap-3 mb-6"
        style={{
          padding: '16px 20px',
          background: '#faf6f1',
          border: '1px solid rgba(81,31,41,0.1)',
        }}
      >
        <div className="h-11 flex-1 min-w-[280px] bg-white animate-pulse" />
        <div className="h-11 w-40 bg-white animate-pulse" />
        <div className="h-11 w-40 bg-white animate-pulse" />
      </div>

      {/* Table skeleton */}
      <div
        style={{
          background: 'white',
          border: '1px solid rgba(81,31,41,0.1)',
        }}
      >
        {/* Header */}
        <div
          className="h-12 bg-[#faf6f1]"
          style={{ borderBottom: '1px solid rgba(81,31,41,0.1)' }}
        />

        {/* Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse"
            style={{
              borderBottom:
                i < 5 ? '1px solid rgba(81,31,41,0.1)' : 'none',
              background: i % 2 === 0 ? '#faf6f1' : 'white',
              opacity: 1 - i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersData searchParams={searchParams} />
    </Suspense>
  );
}
