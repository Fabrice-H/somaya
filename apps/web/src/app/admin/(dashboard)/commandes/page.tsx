import { Suspense } from "react";
import type { Metadata } from "next";
import { OrdersClient } from "@/features/orders/components/admin/OrdersClient";
import { OrdersSkeleton } from "@/features/orders/components/admin/list/OrdersSkeleton";
import { ordersFilterSchema } from "@/features/orders/schemas";
import { getOrders, getOrdersStats } from "@/features/orders/server/queries";

export const metadata: Metadata = {
  title: "Commandes | Admin SO'MAYA",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function OrdersData({ searchParams }: { searchParams: SearchParams }) {
  const filter = ordersFilterSchema.parse(await searchParams);
  const [{ orders, total, page, totalPages }, stats] = await Promise.all([getOrders(filter), getOrdersStats()]);

  return <OrdersClient orders={orders} stats={stats} total={total} page={page} totalPages={totalPages} />;
}

export default function OrdersPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersData searchParams={searchParams} />
    </Suspense>
  );
}
