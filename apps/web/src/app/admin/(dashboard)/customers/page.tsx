import { Suspense } from "react";
import type { Metadata } from "next";
import { CustomersClient } from "@/features/customers/components/admin/CustomersClient";
import { CustomersSkeleton } from "@/features/customers/components/admin/list/CustomersSkeleton";
import { customersFilterSchema } from "@/features/customers/schemas";
import { getCustomers, getCustomersStats } from "@/features/customers/server/queries";

export const metadata: Metadata = {
  title: "Clients | Admin SO'MAYA",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function CustomersData({ searchParams }: { searchParams: SearchParams }) {
  const filter = customersFilterSchema.parse(await searchParams);
  const [{ customers, total, page, totalPages }, stats] = await Promise.all([
    getCustomers(filter),
    getCustomersStats(),
  ]);

  return <CustomersClient customers={customers} stats={stats} total={total} page={page} totalPages={totalPages} />;
}

export default function CustomersPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<CustomersSkeleton />}>
      <CustomersData searchParams={searchParams} />
    </Suspense>
  );
}
