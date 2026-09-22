import "server-only";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { PRICE_LOTS_CACHE_TAG } from "@/features/lots/constants";
import { PRODUCTS_CACHE_TAG } from "@/features/products/constants";
import { db, orderItems, orders, priceLots, productLots, products } from "@/shared/lib/db";
import type { OrderItem } from "@/shared/lib/db/schema";
import { adjustItemStock, clampStock, shortfallWarning } from "../adjust";

export type StockResult = { changed: boolean; warnings: string[] };

export async function applyOrderStock(orderId: string): Promise<StockResult> {
  const [claimed] = await db
    .update(orders)
    .set({ stockAppliedAt: new Date() })
    .where(and(eq(orders.id, orderId), isNull(orders.stockAppliedAt)))
    .returning({ id: orders.id });
  if (!claimed) return { changed: false, warnings: [] };

  const lines = await db.query.orderItems.findMany({ where: eq(orderItems.orderId, orderId) });
  const warnings = await adjustLines(lines, -1);
  invalidateCatalog();
  return { changed: true, warnings };
}

export async function restoreOrderStock(orderId: string): Promise<StockResult> {
  const [claimed] = await db
    .update(orders)
    .set({ stockAppliedAt: null })
    .where(and(eq(orders.id, orderId), isNotNull(orders.stockAppliedAt)))
    .returning({ id: orders.id });
  if (!claimed) return { changed: false, warnings: [] };

  const lines = await db.query.orderItems.findMany({ where: eq(orderItems.orderId, orderId) });
  await adjustLines(lines, 1);
  invalidateCatalog();
  return { changed: true, warnings: [] };
}

function invalidateCatalog() {
  revalidateTag(PRODUCTS_CACHE_TAG, "max");
  revalidateTag(PRICE_LOTS_CACHE_TAG, "max");
}

async function adjustLines(lines: OrderItem[], direction: 1 | -1): Promise<string[]> {
  const warnings: string[] = [];
  for (const line of lines) {
    const warning = await adjustLine(line, line.quantity * direction);
    if (warning) warnings.push(warning);
  }
  return warnings;
}

async function adjustLine(line: OrderItem, delta: number): Promise<string | null> {
  const requested = Math.abs(delta);
  const name = line.lotName ? `${line.productName} · ${line.lotName}` : line.productName;

  if (line.priceLotId) {
    if (!line.itemId) return `« ${name} » : article de lot non identifié, stock non ajusté`;
    const lot = await db.query.priceLots.findFirst({ where: eq(priceLots.id, line.priceLotId) });
    if (!lot) return `« ${name} » : lot introuvable, stock non ajusté`;
    const result = adjustItemStock(lot.items ?? [], line.itemId, delta);
    if (!result.found) return `« ${name} » : article de lot introuvable, stock non ajusté`;
    await db.update(priceLots).set({ items: result.items, updatedAt: new Date() }).where(eq(priceLots.id, lot.id));
    return delta < 0 ? shortfallWarning(name, result.before, requested) : null;
  }

  if (line.lotId) {
    const lot = await db.query.productLots.findFirst({ where: eq(productLots.id, line.lotId) });
    if (!lot) return `« ${name} » : option introuvable, stock non ajusté`;
    const result = line.itemId ? adjustItemStock(lot.items ?? [], line.itemId, delta) : null;
    if (result?.found) {
      await db
        .update(productLots)
        .set({ items: result.items, updatedAt: new Date() })
        .where(eq(productLots.id, lot.id));
      return delta < 0 ? shortfallWarning(name, result.before, requested) : null;
    }
    await db
      .update(productLots)
      .set({ stock: clampStock(lot.stock + delta), updatedAt: new Date() })
      .where(eq(productLots.id, lot.id));
    return delta < 0 ? shortfallWarning(name, lot.stock, requested) : null;
  }

  if (line.productId) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, line.productId),
      columns: { id: true, stock: true },
    });
    if (!product) return `« ${name} » : produit introuvable, stock non ajusté`;
    await db
      .update(products)
      .set({ stock: clampStock(product.stock + delta), updatedAt: new Date() })
      .where(eq(products.id, product.id));
    return delta < 0 ? shortfallWarning(name, product.stock, requested) : null;
  }

  return `« ${name} » : produit supprimé, stock non ajusté`;
}
