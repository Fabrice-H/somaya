import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomerDetailView } from "@/features/customers/components/admin/detail/CustomerDetailView";
import { getCustomer } from "@/features/customers/server/queries";

export const metadata: Metadata = {
  title: "Fiche client | Admin SO'MAYA",
};

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomer(id);
  if (!customer) notFound();

  return <CustomerDetailView customer={customer} />;
}
