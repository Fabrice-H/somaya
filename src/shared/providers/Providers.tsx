"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { CartSidebar } from "@/features/cart/components/CartSidebar";
import { useWishlistStore } from "@/features/wishlist/store";

function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useWishlistStore.persist.rehydrate();
  }, []);

  return (
    <>
      <ScrollToTop />
      {children}
      <CartSidebar />
    </>
  );
}
