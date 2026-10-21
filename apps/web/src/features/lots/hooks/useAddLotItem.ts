import { useCartStore } from "@/features/cart/store";
import type { FlatLotItem } from "../types";

export function useAddLotItem() {
  const addItem = useCartStore((state) => state.addItem);
  return ({ item, lot }: FlatLotItem) =>
    addItem({
      productId: `lot-${lot.id}`,
      productName: item.label || lot.name,
      productSlug: `lot-${lot.id}`,
      productImage: item.image,
      categoryName: lot.category?.name || "",
      price: lot.price,
      stock: item.stock,
      lotId: lot.id,
      lotName: lot.name,
      lotPrice: lot.price,
      lotStock: item.stock,
      itemId: item.id,
      itemLabel: item.label,
    });
}
