import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { db, priceLots, productLots, products } from "@/shared/lib/db";
import type { PriceLotItem } from "@/features/lots/types";
import { PRICE_LOT_PREFIX, VARIANT_PREFIX } from "../constants";
import type { CheckoutLine } from "../schemas";
import type { PricedLine } from "../types";

export class PricingError extends Error {}

const parseVariant = (itemId: string | null) => {
  if (!itemId?.startsWith(VARIANT_PREFIX)) return { color: null, size: null };
  const [color, size] = itemId.slice(VARIANT_PREFIX.length).split("|");
  return { color: color || null, size: size || null };
};

const ensureStock = (name: string, stock: number, quantity: number) => {
  if (stock < quantity) {
    throw new PricingError(stock <= 0 ? `« ${name} » n'est plus disponible` : `Il ne reste que ${stock} « ${name} »`);
  }
};

const line = (data: Omit<PricedLine, "lineTotal">): PricedLine => ({
  ...data,
  lineTotal: data.unitPrice * data.quantity,
});

export async function priceCheckoutLines(lines: CheckoutLine[]): Promise<PricedLine[]> {
  const priceLotIds = lines
    .filter((l) => l.productId.startsWith(PRICE_LOT_PREFIX))
    .map((l) => l.lotId!)
    .filter(Boolean);
  const productIds = lines.filter((l) => !l.productId.startsWith(PRICE_LOT_PREFIX)).map((l) => l.productId);
  const productLotIds = lines.filter((l) => !l.productId.startsWith(PRICE_LOT_PREFIX) && l.lotId).map((l) => l.lotId!);

  const [lotRows, productRows, productLotRows] = await Promise.all([
    priceLotIds.length
      ? db.query.priceLots.findMany({ where: and(inArray(priceLots.id, priceLotIds), eq(priceLots.isActive, true)) })
      : [],
    productIds.length
      ? db.query.products.findMany({ where: and(inArray(products.id, productIds), eq(products.isActive, true)) })
      : [],
    productLotIds.length
      ? db.query.productLots.findMany({
          where: and(inArray(productLots.id, productLotIds), eq(productLots.isAvailable, true)),
        })
      : [],
  ]);

  const priceLotById = new Map(lotRows.map((row) => [row.id, row]));
  const productById = new Map(productRows.map((row) => [row.id, row]));
  const productLotById = new Map(productLotRows.map((row) => [row.id, row]));

  return lines.map((cartLine) => {
    if (cartLine.productId.startsWith(PRICE_LOT_PREFIX)) {
      const lot = cartLine.lotId ? priceLotById.get(cartLine.lotId) : undefined;
      const item = ((lot?.items as PriceLotItem[] | null) ?? []).find((i) => i.id === cartLine.itemId);
      if (!lot || !item) throw new PricingError("Un article de votre panier n'est plus disponible");
      const name = item.label || lot.name;
      ensureStock(name, item.stock, cartLine.quantity);
      return line({
        productId: null,
        lotId: null,
        name,
        variant: name === lot.name ? null : lot.name,
        color: null,
        size: null,
        image: item.image,
        unitPrice: Number(lot.price),
        quantity: cartLine.quantity,
      });
    }

    const product = productById.get(cartLine.productId);
    if (!product) throw new PricingError("Un article de votre panier n'est plus disponible");

    if (cartLine.lotId) {
      const productLot = productLotById.get(cartLine.lotId);
      if (!productLot || productLot.productId !== product.id) {
        throw new PricingError(`« ${product.name} » n'est plus disponible dans cette option`);
      }
      const item = ((productLot.items as PriceLotItem[] | null) ?? []).find((i) => i.id === cartLine.itemId);
      ensureStock(product.name, item?.stock ?? productLot.stock, cartLine.quantity);
      return line({
        productId: product.id,
        lotId: productLot.id,
        name: product.name,
        variant: [productLot.name, item?.label].filter(Boolean).join(" · "),
        color: null,
        size: null,
        image: item?.image ?? product.images?.[0] ?? null,
        unitPrice: Number(productLot.price),
        quantity: cartLine.quantity,
      });
    }

    ensureStock(product.name, product.stock, cartLine.quantity);
    const { color, size } = parseVariant(cartLine.itemId);
    return line({
      productId: product.id,
      lotId: null,
      name: product.name,
      variant: [color, size && `Taille ${size}`].filter(Boolean).join(" · ") || null,
      color,
      size,
      image: product.images?.[0] ?? null,
      unitPrice: Number(product.price),
      quantity: cartLine.quantity,
    });
  });
}
