import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  categoryName: string;
  price: number;
  stock: number;
  quantity: number;
  // Lot info (optional)
  lotId: string | null;
  lotName: string | null;
  lotPrice: number | null;
  lotStock: number | null;
  // Item info (for lot items with individual stock)
  itemId: string | null;
  itemLabel: string | null;
}

export interface AddItemParams {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  categoryName: string;
  price: number;
  stock: number;
  lotId?: string | null;
  lotName?: string | null;
  lotPrice?: number | null;
  lotStock?: number | null;
  itemId?: string | null;
  itemLabel?: string | null;
}

export interface AddItemResult {
  success: boolean;
  stockLimitReached: boolean;
  currentQuantity: number;
  maxStock: number;
}

// Generate a unique key for cart items
// For lot items: productId:lotId:itemId
// For standard lots (legacy): productId:lotId
// For standard products: productId
function getCartKey(productId: string, lotId?: string | null, itemId?: string | null): string {
  if (lotId && itemId) {
    return `${productId}:${lotId}:${itemId}`;
  }
  if (lotId) {
    return `${productId}:${lotId}`;
  }
  return productId;
}

interface CartState {
  items: Record<string, CartItem>;
  isOpen: boolean;

  // Actions
  addItem: (params: AddItemParams, quantity?: number) => AddItemResult;
  removeItem: (productId: string, lotId?: string | null, itemId?: string | null) => void;
  updateQuantity: (productId: string, quantity: number, lotId?: string | null, itemId?: string | null) => void;
  incrementItem: (productId: string, lotId?: string | null, itemId?: string | null) => void;
  decrementItem: (productId: string, lotId?: string | null, itemId?: string | null) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  hasItems: () => boolean;
  getItems: () => CartItem[];
  getItemQuantity: (productId: string, lotId?: string | null, itemId?: string | null) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      isOpen: false,

      addItem: (params, quantity = 1) => {
        const key = getCartKey(params.productId, params.lotId, params.itemId);
        const existingItem = get().items[key];

        // Determine stock limit (lot stock if lot, otherwise product stock)
        const maxStock = params.lotStock ?? params.stock;

        // Check if already at stock limit
        if (existingItem && existingItem.quantity >= maxStock) {
          set({ isOpen: true });
          return {
            success: false,
            stockLimitReached: true,
            currentQuantity: existingItem.quantity,
            maxStock,
          };
        }

        if (existingItem) {
          // Increment quantity
          const newQuantity = Math.min(existingItem.quantity + quantity, maxStock);
          set((state) => ({
            items: {
              ...state.items,
              [key]: { ...existingItem, quantity: newQuantity },
            },
            isOpen: true,
          }));
          return {
            success: true,
            stockLimitReached: newQuantity >= maxStock,
            currentQuantity: newQuantity,
            maxStock,
          };
        }

        // Add new item
        const newItem: CartItem = {
          productId: params.productId,
          productName: params.productName,
          productSlug: params.productSlug,
          productImage: params.productImage,
          categoryName: params.categoryName,
          price: params.price,
          stock: params.stock,
          quantity,
          lotId: params.lotId ?? null,
          lotName: params.lotName ?? null,
          lotPrice: params.lotPrice ?? null,
          lotStock: params.lotStock ?? null,
          itemId: params.itemId ?? null,
          itemLabel: params.itemLabel ?? null,
        };

        set((state) => ({
          items: { ...state.items, [key]: newItem },
          isOpen: true,
        }));

        return {
          success: true,
          stockLimitReached: maxStock <= quantity,
          currentQuantity: quantity,
          maxStock,
        };
      },

      removeItem: (productId, lotId, itemId) => {
        const key = getCartKey(productId, lotId, itemId);
        set((state) => {
          const newItems = { ...state.items };
          delete newItems[key];
          return { items: newItems };
        });
      },

      updateQuantity: (productId, quantity, lotId, itemId) => {
        const key = getCartKey(productId, lotId, itemId);
        if (quantity <= 0) {
          get().removeItem(productId, lotId, itemId);
          return;
        }
        set((state) => {
          const existingItem = state.items[key];
          if (!existingItem) return state;
          const maxStock = existingItem.lotStock ?? existingItem.stock;
          return {
            items: {
              ...state.items,
              [key]: { ...existingItem, quantity: Math.min(quantity, maxStock) },
            },
          };
        });
      },

      incrementItem: (productId, lotId, itemId) => {
        const key = getCartKey(productId, lotId, itemId);
        set((state) => {
          const existingItem = state.items[key];
          if (!existingItem) return state;
          const maxStock = existingItem.lotStock ?? existingItem.stock;
          const newQuantity = Math.min(existingItem.quantity + 1, maxStock);
          return {
            items: {
              ...state.items,
              [key]: { ...existingItem, quantity: newQuantity },
            },
          };
        });
      },

      decrementItem: (productId, lotId, itemId) => {
        const key = getCartKey(productId, lotId, itemId);
        const existingItem = get().items[key];
        if (!existingItem) return;

        if (existingItem.quantity <= 1) {
          get().removeItem(productId, lotId, itemId);
        } else {
          set((state) => ({
            items: {
              ...state.items,
              [key]: { ...existingItem, quantity: existingItem.quantity - 1 },
            },
          }));
        }
      },

      clearCart: () => set({ items: {} }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () => {
        return Object.values(get().items).reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return Object.values(get().items).reduce((total, item) => {
          const price = item.lotPrice ?? item.price;
          return total + price * item.quantity;
        }, 0);
      },

      hasItems: () => {
        return Object.keys(get().items).length > 0;
      },

      getItems: () => {
        return Object.values(get().items);
      },

      getItemQuantity: (productId, lotId, itemId) => {
        const key = getCartKey(productId, lotId, itemId);
        const item = get().items[key];
        return item?.quantity ?? 0;
      },
    }),
    {
      name: "somaya-cart",
      version: 3, // Bump version for new itemId field
      migrate: (persistedState: unknown, version: number) => {
        // Clear old cart data on version change (breaking change)
        if (version < 3) {
          return { items: {}, isOpen: false };
        }
        return persistedState;
      },
    }
  )
);
