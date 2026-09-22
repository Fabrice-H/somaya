import type { Metadata } from "next";
import { AccountShell } from "@/features/account/components/AccountShell";
import { PasswordForm, ProfileForm } from "@/features/account/components/ProfileForms";
import { toAccountCustomer } from "@/features/account/server/mappers";
import { requireCustomer } from "@/features/account/server/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mes informations | SO'MAYA",
  robots: { index: false },
};

export default async function AccountProfilePage() {
  const customer = await requireCustomer("/compte/informations");
  return (
    <AccountShell firstName={customer.firstName} guest={customer.isGuest && !customer.passwordHash}>
      <div className="space-y-8">
        <ProfileForm customer={toAccountCustomer(customer)} />
        <PasswordForm guest={customer.isGuest && !customer.passwordHash} />
      </div>
    </AccountShell>
  );
}
