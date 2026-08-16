"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Menu, X, Tag } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useRouter } from "next/navigation";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { openCart, getItemCount, hasItems } = useCartStore();
  const itemCount = getItemCount();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Prevent hydration mismatch by only rendering cart badge after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Focus search input when opening
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogue?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Close search on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isSearchOpen]);

  return (
    <header className="sticky top-0 z-[60] glass-header border-b border-[var(--som-burgundy)]/10">
      <div className="container-som h-[74px] grid grid-cols-[1fr_auto_1fr] items-center gap-5">
        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-[30px]">
          <Link
            href="/catalogue"
            className="font-[family-name:var(--font-body)] text-[12.5px] font-medium tracking-[0.13em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors no-underline"
          >
            Boutique
          </Link>
          <Link
            href="/lots"
            className="font-[family-name:var(--font-body)] text-[12.5px] font-medium tracking-[0.13em] uppercase text-[var(--som-burgundy)] hover:text-[var(--som-text)] transition-colors no-underline flex items-center gap-1.5"
          >
            <Tag className="w-3.5 h-3.5" />
            Par Budget
          </Link>
          <Link
            href="/a-propos"
            className="font-[family-name:var(--font-body)] text-[12.5px] font-medium tracking-[0.13em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors no-underline"
          >
            À propos
          </Link>
          <Link
            href="/contact"
            className="font-[family-name:var(--font-body)] text-[12.5px] font-medium tracking-[0.13em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors no-underline"
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
            onClick={() => setIsSearchOpen(true)}
            aria-label="Recherche"
            className="text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors"
          >
            <Search className="w-[19px] h-[19px]" strokeWidth={1.5} />
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

      {/* Search Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-[#511F29]/30"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-4xl mx-auto px-5 py-8">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#511F29]/50" strokeWidth={1.5} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-14 pr-14 py-5 text-xl text-[#2a181d] bg-[#faf6f1] border-2 border-[#511F29]/20 focus:border-[#511F29] focus:bg-white rounded-none outline-none transition-all placeholder:text-[#511F29]/40"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#511F29]/50 hover:text-[#511F29] transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-[#511F29]/60">
                    Appuyez sur <span className="font-medium text-[#511F29]">Entrée</span> pour rechercher
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-sm text-[#511F29]/60 hover:text-[#511F29] transition-colors"
                  >
                    Échap pour fermer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--som-burgundy)]/10 bg-[var(--som-cream)]">
          <nav className="container-som py-4 flex flex-col gap-4">
            <Link
              href="/catalogue"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-[family-name:var(--font-body)] text-[12.5px] font-medium tracking-[0.13em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors no-underline"
            >
              Boutique
            </Link>
            <Link
              href="/lots"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-[family-name:var(--font-body)] text-[12.5px] font-medium tracking-[0.13em] uppercase text-[var(--som-burgundy)] hover:text-[var(--som-text)] transition-colors no-underline flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5" />
              Par Budget
            </Link>
            <Link
              href="/a-propos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-[family-name:var(--font-body)] text-[12.5px] font-medium tracking-[0.13em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors no-underline"
            >
              À propos
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-[family-name:var(--font-body)] text-[12.5px] font-medium tracking-[0.13em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors no-underline"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
