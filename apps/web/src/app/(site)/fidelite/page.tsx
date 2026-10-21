import type { Metadata } from "next";
import Link from "next/link";
import { getCustomerSession } from "@/features/account/server/session";
import { ACCOUNT_PATH } from "@/features/account/constants";
import { LoyaltyProgramContent } from "@/features/loyalty/components/LoyaltyProgramContent";
import { getPublicLoyaltySettings } from "@/features/loyalty/server/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programme fidélité | SO'MAYA",
  description:
    "Le Club SO'MAYA : cumulez des points à chaque commande livrée et profitez d'avantages réservés à nos fidèles.",
};

export default async function FidelitePage() {
  const [settings, customer] = await Promise.all([getPublicLoyaltySettings(), getCustomerSession()]);
  return (
    <>
      {customer && (
        <div className="bg-[var(--som-primary)] px-4 py-3 text-center text-[13px] text-white">
          {customer.firstName}, vous avez <span className="font-medium tabular-nums">{customer.loyaltyPoints}</span>{" "}
          point
          {customer.loyaltyPoints > 1 ? "s" : ""}.{" "}
          <Link href={ACCOUNT_PATH} className="underline underline-offset-4 hover:text-white/80">
            Voir mon compte
          </Link>
        </div>
      )}
      <LoyaltyProgramContent settings={settings} />
    </>
  );
}
