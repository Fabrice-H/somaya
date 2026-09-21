import type { CartItem } from "./store";

export const unitPrice = (item: CartItem) => item.lotPrice ?? item.price;
export const lineTotal = (item: CartItem) => unitPrice(item) * item.quantity;
export const maxQuantity = (item: CartItem) => item.lotStock ?? item.stock;
export const itemVariant = (item: CartItem) => item.itemLabel ?? item.lotName;
export const itemHref = (item: CartItem) => (item.productId.startsWith("lot-") ? "/lots" : `/produit/${item.productSlug}`);
export const cartLineKey = (item: CartItem) => [item.productId, item.lotId, item.itemId].filter(Boolean).join(":");
