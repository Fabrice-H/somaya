import { useMemo, useState } from "react";
import { useCartStore } from "@/features/cart/store";
import type { ProductWithCategoryAndLots } from "@/shared/lib/db/schema";
import type { SelectedLotItem } from "../types";
import { toLotOptions, variantLabel } from "../utils";

const FEEDBACK_DURATION_MS = 2000;

export function useProductPurchase(product: ProductWithCategoryAndLots) {
  const addItem = useCartStore((state) => state.addItem);
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);

  const lotOptions = useMemo(() => toLotOptions(product.lots ?? []), [product.lots]);
  const colors = product.colors ?? [];
  const sizes = product.sizes ?? [];
  const hasLots = lotOptions.length > 0;

  const [selectedItem, setSelectedItem] = useState<SelectedLotItem | null>(null);
  const [color, setColor] = useState<string | null>(colors[0] ?? null);
  const [size, setSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variant = hasLots ? null : variantLabel(color, size);
  const variantKey = variant ? `variant:${color ?? ""}|${size ?? ""}` : null;

  const unitPrice = selectedItem ? selectedItem.lotPrice : Number(product.price);
  const maxStock = selectedItem ? selectedItem.itemStock : product.stock;
  const inCart = selectedItem
    ? getItemQuantity(product.id, selectedItem.lotId, selectedItem.itemId)
    : getItemQuantity(product.id, null, variantKey);
  const availableStock = Math.max(0, maxStock - inCart);

  const missingChoice = hasLots
    ? !selectedItem && "Sélectionnez un article"
    : (sizes.length > 0 && !size && "Choisissez une taille") || (colors.length > 0 && !color && "Choisissez une couleur");

  const isSoldOut = hasLots ? lotOptions.every((lot) => lot.items.every((item) => item.stock <= 0)) : product.stock <= 0;
  const canAdd = !missingChoice && availableStock > 0;

  const resetFeedback = () => {
    setError(null);
    setAdded(false);
  };

  const selectItem = (item: SelectedLotItem) => {
    setSelectedItem(item);
    setQuantity(1);
    resetFeedback();
  };

  const changeQuantity = (next: number) => {
    if (next < 1) return;
    if (next > availableStock) {
      setError(inCart > 0 ? `Vous avez déjà ${inCart} article(s) dans votre panier` : "Stock maximum atteint");
      return;
    }
    setError(null);
    setQuantity(next);
  };

  const addToCart = () => {
    if (missingChoice) {
      setError(missingChoice);
      return;
    }
    if (quantity > availableStock) {
      setError(availableStock <= 0 ? "Ce produit n'est plus disponible" : `Seulement ${availableStock} article(s) disponible(s)`);
      return;
    }

    const result = addItem(
      {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        productImage: selectedItem?.itemImage ?? product.images?.[0] ?? "/images/logo_mark.png",
        categoryName: product.category?.name ?? "",
        price: Number(product.price),
        stock: product.stock,
        lotId: selectedItem?.lotId ?? null,
        lotName: selectedItem?.lotName ?? variant,
        lotPrice: selectedItem?.lotPrice ?? null,
        lotStock: selectedItem?.itemStock ?? null,
        itemId: selectedItem?.itemId ?? variantKey,
        itemLabel: selectedItem?.itemLabel ?? variant,
      },
      quantity
    );

    if (result.stockLimitReached) setError("Stock maximum atteint");
    setAdded(true);
    setTimeout(() => setAdded(false), FEEDBACK_DURATION_MS);
  };

  return {
    lotOptions,
    hasLots,
    colors,
    sizes,
    color,
    size,
    setColor: (value: string) => {
      setColor(value);
      resetFeedback();
    },
    setSize: (value: string) => {
      setSize(value);
      resetFeedback();
    },
    selectedItem,
    selectItem,
    quantity,
    changeQuantity,
    unitPrice,
    maxStock,
    isSoldOut,
    canAdd,
    added,
    error,
    addToCart,
  };
}
