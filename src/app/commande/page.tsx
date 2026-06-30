import { Metadata } from "next";
import { CheckoutContent } from "./CheckoutContent";

export const metadata: Metadata = {
  title: "Commande | SO'MAYA - Mode & Accessoires",
  description:
    "Finalisez votre commande SO'MAYA. Livraison à Abidjan et environs.",
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}
