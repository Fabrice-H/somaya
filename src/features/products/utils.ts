import type { ProductLot } from "@/shared/lib/db/schema";
import type { LotOption, LotOptionItem } from "./types";

export function toLotOptions(lots: ProductLot[]): LotOption[] {
  return lots.map((lot) => {
    const items = (lot.items as LotOptionItem[] | null) ?? [];
    const images = lot.images ?? [];
    return {
      id: lot.id,
      name: lot.name,
      price: Number(lot.price),
      isAvailable: lot.isAvailable,
      items:
        items.length > 0
          ? items
          : images.map((image, index) => ({
              id: `legacy-${lot.id}-${index}`,
              image,
              stock: Math.floor(lot.stock / images.length),
            })),
    };
  });
}

export function variantLabel(color: string | null, size: string | null): string | null {
  const parts = [color, size && `Taille ${size}`].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function discountPercent(price: number, oldPrice: number | null): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}
