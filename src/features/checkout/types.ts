export type PricedLine = {
  productId: string | null;
  lotId: string | null;
  priceLotId: string | null;
  itemId: string | null;
  name: string;
  variant: string | null;
  color: string | null;
  size: string | null;
  image: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

import type { CheckoutCustomer, CheckoutPaymentMethod, DeliveryMethod } from "./schemas";

export type PlacedOrder = {
  customer: CheckoutCustomer;
  deliveryMethod: DeliveryMethod;
  paymentMethod: CheckoutPaymentMethod;
  checkoutUrl: string | null;
  paymentError: string | null;
  orderNumber: string;
  lines: PricedLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export type PlaceOrderResult =
  { ok: true; order: PlacedOrder } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
