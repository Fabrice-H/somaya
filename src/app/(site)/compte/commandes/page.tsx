import type { Metadata } from "next";
import { AccountOrdersList } from "@/features/account/components/AccountOrdersList";
import { AccountShell } from "@/features/account/components/AccountShell";
import { ClaimOrderForm } from "@/features/account/components/ClaimOrderForm";
import { getAccountOrders, getHiddenOrdersCount } from "@/features/account/server/queries";
import { requireCustomer } from "@/features/account/server/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mes commandes | SO'MAYA",
  robots: { index: false },
};

export default async function AccountOrdersPage() {
  const customer = await requireCustomer("/compte/commandes");
  const [orders, hiddenCount] = await Promise.all([getAccountOrders(customer), getHiddenOrdersCount(customer)]);
  return (
    <AccountShell firstName={customer.firstName}>
      <div className="space-y-10">
        <section>
          <h2 className="m-0 mb-4 text-[11px] uppercase tracking-[0.24em] text-[var(--som-gray)]">Mes commandes</h2>
          <AccountOrdersList orders={orders} emptyText="Aucune commande pour le moment." />
        </section>
        <ClaimOrderForm hiddenCount={hiddenCount} />
      </div>
    </AccountShell>
  );
}
