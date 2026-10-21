import type { Metadata } from "next";
import { PaymentReturnContent } from "@/features/payments/components/PaymentReturnContent";
import { getPaymentReturnView } from "@/features/payments/server/queries";
import { getStoreContact } from "@/features/settings/server/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Paiement | SO'MAYA",
  robots: { index: false, follow: false },
};

export default async function PaymentReturnPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  const orderNumber = typeof ref === "string" ? ref.toUpperCase().slice(0, 50) : "";
  const [view, contact] = await Promise.all([getPaymentReturnView(orderNumber), getStoreContact()]);
  return <PaymentReturnContent view={view} whatsapp={contact.whatsapp} />;
}
