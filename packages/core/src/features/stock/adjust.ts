type StockItem = { id: string; stock: number };

export type ItemAdjustment<T extends StockItem> = { items: T[]; found: boolean; before: number; after: number };

export function adjustItemStock<T extends StockItem>(items: T[], itemId: string, delta: number): ItemAdjustment<T> {
  const target = items.find((item) => item.id === itemId);
  if (!target) return { items, found: false, before: 0, after: 0 };
  const after = clampStock(target.stock + delta);
  return {
    items: items.map((item) => (item.id === itemId ? { ...item, stock: after } : item)),
    found: true,
    before: target.stock,
    after,
  };
}

export function clampStock(value: number): number {
  return Math.max(0, Math.round(value));
}

export function shortfallWarning(name: string, available: number, requested: number): string | null {
  if (requested <= available) return null;
  return available <= 0
    ? `« ${name} » était déjà en rupture (${requested} demandé${requested > 1 ? "s" : ""})`
    : `Stock insuffisant pour « ${name} » : ${available} disponible${available > 1 ? "s" : ""}, ${requested} demandé${requested > 1 ? "s" : ""}`;
}
