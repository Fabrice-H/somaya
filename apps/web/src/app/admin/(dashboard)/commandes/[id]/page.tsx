import { notFound } from "next/navigation";
import { OrderDetailView } from "@/features/orders/components/admin/detail/OrderDetailView";
import { getOrder } from "@/features/orders/server/queries";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return <OrderDetailView order={order} />;
}
