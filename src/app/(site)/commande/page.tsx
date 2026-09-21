import type { Metadata } from "next";
import { CheckoutContent } from "@/features/checkout/components/CheckoutContent";
import { getDeliveryFee, getStoreContact } from "@/features/settings/server/queries";

export const metadata: Metadata = {
  title: "Commande | SO'MAYA - Mode & Accessoires",
  description: "Finalisez votre commande SO'MAYA. Livraison à Abidjan et environs.",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const [deliveryFee, contact] = await Promise.all([getDeliveryFee(), getStoreContact()]);
  return (
    <CheckoutContent
      deliveryFee={deliveryFee}
      whatsapp={contact.whatsapp}
      storeAddress={contact.address}
      storeHours={contact.hours}
    />
  );
}
