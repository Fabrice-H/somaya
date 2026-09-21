export const ABIDJAN_COMMUNES = [
  "Abobo",
  "Adjamé",
  "Anyama",
  "Attécoubé",
  "Bingerville",
  "Cocody",
  "Koumassi",
  "Marcory",
  "Plateau",
  "Port-Bouët",
  "Songon",
  "Treichville",
  "Yopougon",
] as const;

export const MAX_CART_LINES = 50;
export const MAX_LINE_QUANTITY = 20;
export const PRICE_LOT_PREFIX = "lot-";
export const VARIANT_PREFIX = "variant:";

export const DELIVERY_METHODS = ["delivery", "pickup"] as const;

export const CHECKOUT_STEPS = [
  { id: "details", label: "Coordonnées" },
  { id: "shipping", label: "Livraison" },
  { id: "payment", label: "Paiement" },
] as const;

export const PICKUP_LABEL = "Retrait en boutique";
