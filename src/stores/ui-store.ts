import { create } from "zustand";

interface UIState {
  // Checkout
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  // Catalog
  isCatalogOpen: boolean;
  openCatalog: (category?: string) => void;
  closeCatalog: () => void;
  catalogCategory: string;

  // Product detail
  currentProductId: string | null;
  openProduct: (productId: string) => void;
  closeProduct: () => void;

  // Quick view
  quickViewProductId: string | null;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;

  // Wishlist
  wishlist: Set<string>;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Mobile menu
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Checkout
  isCheckoutOpen: false,
  openCheckout: () => set({ isCheckoutOpen: true }),
  closeCheckout: () => set({ isCheckoutOpen: false }),

  // Catalog
  isCatalogOpen: false,
  catalogCategory: "Tous",
  openCatalog: (category = "Tous") =>
    set({ isCatalogOpen: true, catalogCategory: category, currentProductId: null, quickViewProductId: null }),
  closeCatalog: () => set({ isCatalogOpen: false }),

  // Product detail
  currentProductId: null,
  openProduct: (productId) =>
    set({ currentProductId: productId, isCatalogOpen: false, quickViewProductId: null }),
  closeProduct: () => set({ currentProductId: null }),

  // Quick view
  quickViewProductId: null,
  openQuickView: (productId) => set({ quickViewProductId: productId }),
  closeQuickView: () => set({ quickViewProductId: null }),

  // Wishlist
  wishlist: new Set(),
  toggleWishlist: (productId) =>
    set((state) => {
      const newWishlist = new Set(state.wishlist);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return { wishlist: newWishlist };
    }),
  isInWishlist: (productId) => get().wishlist.has(productId),

  // Mobile menu
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));
