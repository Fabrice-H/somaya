import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  items: Record<string, number>;
  isOpen: boolean;

  // Actions
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed
  getItemCount: () => number;
  hasItems: () => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      isOpen: false,

      addItem: (productId, quantity = 1) => {
        set((state) => ({
          items: {
            ...state.items,
            [productId]: (state.items[productId] || 0) + quantity,
          },
          isOpen: true,
        }));
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = { ...state.items };
          delete newItems[productId];
          return { items: newItems };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: { ...state.items, [productId]: quantity },
        }));
      },

      incrementItem: (productId) => {
        set((state) => ({
          items: {
            ...state.items,
            [productId]: (state.items[productId] || 0) + 1,
          },
        }));
      },

      decrementItem: (productId) => {
        const currentQty = get().items[productId] || 0;
        if (currentQty <= 1) {
          get().removeItem(productId);
        } else {
          set((state) => ({
            items: { ...state.items, [productId]: currentQty - 1 },
          }));
        }
      },

      clearCart: () => set({ items: {} }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () => {
        return Object.values(get().items).reduce((acc, qty) => acc + qty, 0);
      },

      hasItems: () => {
        return Object.keys(get().items).length > 0;
      },
    }),
    {
      name: "somaya-cart",
    }
  )
);
