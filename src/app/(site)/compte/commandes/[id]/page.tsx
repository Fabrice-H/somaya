import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountOrderDetailView } from "@/features/account/components/AccountOrderDetailView";
import { AccountShell } from "@/features/account/components/AccountShell";
import { getAccountOrder } from "@/features/account/server/queries";
import { requireCustomer } from "@/features/account/server/session";
import { getStoreContact } from "@/features/settings/server/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ma commande | SO'MAYA",
  robots: { index: false },
};

export default async function AccountOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await requireCustomer(`/compte/commandes/${id}`);
  const [order, contact] = await Promise.all([getAccountOrder(customer, id), getStoreContact()]);
  if (!order) notFound();
  return (
    <AccountShell firstName={customer.firstName}>
      <AccountOrderDetailView order={order} whatsapp={contact.whatsapp} />
    </AccountShell>
  );
}
