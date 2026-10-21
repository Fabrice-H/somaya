import type { Metadata } from "next";
import { AccountOverview } from "@/features/account/components/AccountOverview";
import { AccountShell } from "@/features/account/components/AccountShell";
import { getAccountOverview } from "@/features/account/server/queries";
import { requireCustomer } from "@/features/account/server/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mon compte | SO'MAYA",
  robots: { index: false },
};

export default async function AccountPage() {
  const customer = await requireCustomer("/compte");
  const overview = await getAccountOverview(customer);
  return (
    <AccountShell firstName={customer.firstName} guest={customer.isGuest && !customer.passwordHash}>
      <AccountOverview overview={overview} />
    </AccountShell>
  );
}
