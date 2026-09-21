"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useHasMounted } from "@/shared/hooks/useHasMounted";
import { formatPrice } from "@/shared/lib/format";
import { useCartStore } from "../store";
import { cartLineKey } from "../utils";
import { CartLine } from "./CartLine";

export function CartSidebar() {
  const hasMounted = useHasMounted();
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const itemsByKey = useCartStore((state) => state.items);
  const items = Object.values(itemsByKey);
  const subtotal = items.reduce((sum, item) => sum + (item.lotPrice ?? item.price) * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const open = hasMounted && isOpen;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closeCart]);

  return (
    <div className={`fixed inset-0 z-[110] ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <div
        aria-hidden
        onClick={closeCart}
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`absolute bottom-0 right-0 top-0 flex w-full max-w-[440px] flex-col bg-white transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--som-border)] px-6">
          <h2 id="cart-title" className="m-0 text-[12px] font-medium uppercase tracking-[0.2em] text-[var(--som-ink)]">
            Panier {count > 0 && <span className="text-[var(--som-gray)] tabular-nums">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Fermer le panier"
            className="-mr-3 flex h-11 w-11 cursor-pointer items-center justify-center text-[var(--som-ink)]"
          >
            <X size={20} strokeWidth={1.4} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <Image src="/images/logo_mark.png" alt="" width={330} height={291} className="h-10 w-auto opacity-80" />
            <p className="m-0 mt-6 text-[18px] font-medium text-[var(--som-ink)]">Votre panier est vide</p>
            <p className="m-0 mt-2 text-[14px] font-light text-[var(--som-gray)]">
              Nos pièces vous attendent, sélectionnées avec soin.
            </p>
            <Link href="/catalogue" onClick={closeCart} className="btn-secondary mt-8">
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <>
            <ul className="m-0 flex-1 list-none overflow-y-auto px-6 py-1">
              {items.map((item) => (
                <CartLine key={cartLineKey(item)} item={item} onNavigate={closeCart} />
              ))}
            </ul>

            <footer className="shrink-0 border-t border-[var(--som-border)] px-6 pb-6 pt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] uppercase tracking-[0.18em] text-[var(--som-ink)]">Sous-total</span>
                <span className="text-[18px] tabular-nums text-[var(--som-ink)]">{formatPrice(subtotal)}</span>
              </div>
              <p className="m-0 mt-1 text-[12px] font-light text-[var(--som-gray)]">
                Livraison calculée à l&apos;étape suivante.
              </p>
              <Link href="/commande" onClick={closeCart} className="btn-primary mt-5 w-full">
                Commander
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 flex min-h-11 w-full cursor-pointer items-center justify-center text-[11px] uppercase tracking-[0.18em] text-[var(--som-gray)] transition-colors hover:text-[var(--som-ink)]"
              >
                Continuer mes achats
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
