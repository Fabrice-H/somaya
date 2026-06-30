"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { openCart, getItemCount, hasItems } = useCartStore();
  const itemCount = getItemCount();

  // Prevent hydration mismatch by only rendering cart badge after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-[60] glass-header border-b border-[var(--som-burgundy)]/10">
      <div className="container-som h-[74px] grid grid-cols-[1fr_auto_1fr] items-center gap-5">
        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-[30px]">
          <Link
            href="/catalogue"
            className="text-[12.5px] tracking-[0.13em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors no-underline"
          >
            Boutique
          </Link>
          <Link
            href="/a-propos"
            className="text-[12.5px] tracking-[0.13em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors no-underline"
          >
            À propos
          </Link>
          <Link
            href="#contact"
            className="text-[12.5px] tracking-[0.13em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors no-underline"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[var(--som-text)]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/images/logo_header.png"
            alt="SO'MAYA — La qualité, notre référence"
            width={168}
            height={42}
            className="h-[42px] w-auto"
            priority
          />
        </Link>

        {/* Actions */}
        <div className="flex items-center justify-end gap-5">
          <button
            aria-label="Recherche"
            className="hidden sm:flex text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors"
          >
            <Search className="w-[19px] h-[19px]" strokeWidth={1.5} />
          </button>
          <button
            aria-label="Compte"
            className="hidden sm:flex text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors"
          >
            <User className="w-[19px] h-[19px]" strokeWidth={1.5} />
          </button>
          <button
            onClick={openCart}
            aria-label="Panier"
            className="relative text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors"
          >
            <ShoppingBag className="w-[19px] h-[19px]" strokeWidth={1.5} />
            {isMounted && hasItems() && (
              <span className="absolute -top-[7px] -right-[9px] bg-[var(--som-burgundy)] text-[var(--som-peach)] text-[9px] font-semibold min-w-[15px] h-[15px] rounded-full flex items-center justify-center px-[3px]">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--som-burgundy)]/10 bg-[var(--som-cream)]">
          <nav className="container-som py-4 flex flex-col gap-4">
            <Link
              href="/catalogue"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[12.5px] tracking-[0.13em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors no-underline"
            >
              Boutique
            </Link>
            <Link
              href="/a-propos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[12.5px] tracking-[0.13em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors no-underline"
            >
              À propos
            </Link>
            <Link
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[12.5px] tracking-[0.13em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors no-underline"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
