import { formatPrice } from "@/shared/lib/format";
import type { PlacedOrder } from "./types";

export function buildOrderWhatsAppMessage(order: PlacedOrder): string {
  const { customer } = order;
  const lines = order.lines
    .map((line) => {
      const name = line.variant ? `${line.name} (${line.variant})` : line.name;
      return `- ${name} x${line.quantity} : ${formatPrice(line.lineTotal)}`;
    })
    .join("\n");

  return [
    `*Nouvelle commande SO'MAYA*`,
    `N° ${order.orderNumber}`,
    "",
    `*Client*`,
    `${customer.firstName} ${customer.lastName}`,
    `+225 ${customer.phone}`,
    "",
    `*Livraison*`,
    [customer.address, `${customer.commune}, Abidjan`].filter(Boolean).join("\n"),
    customer.notes ? `Note : ${customer.notes}` : "",
    "",
    `*Articles*`,
    lines,
    "",
    `Livraison : ${formatPrice(order.deliveryFee)}`,
    `*Total : ${formatPrice(order.total)}*`,
  ]
    .filter((part, index, all) => part !== "" || all[index - 1] !== "")
    .join("\n")
    .trim();
}
