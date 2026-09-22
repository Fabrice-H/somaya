import type { Metadata } from "next";
import { getCustomerSession } from "@/features/account/server/session";
import { CheckoutContent } from "@/features/checkout/components/CheckoutContent";
import { getDeliveryFee, getStoreContact } from "@/features/settings/server/queries";
import { localPhone } from "@/shared/lib/phone";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Commande | SO'MAYA - Mode & Accessoires",
  description: "Finalisez votre commande SO'MAYA. Livraison à Abidjan et environs.",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const [deliveryFee, contact, customer] = await Promise.all([
    getDeliveryFee(),
    getStoreContact(),
    getCustomerSession(),
  ]);
  const account = customer
    ? {
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: localPhone(customer.phone),
        email: customer.email ?? "",
        commune: customer.commune ?? "",
        address: customer.address ?? "",
        notes: "",
      }
    : null;
  return (
    <CheckoutContent
      deliveryFee={deliveryFee}
      whatsapp={contact.whatsapp}
      storeAddress={contact.address}
      storeHours={contact.hours}
      account={account}
    />
  );
}
