"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useRouter } from "next/navigation";

interface HeaderProps {
  categories?: Array<{ id: string; name: string; slug: string }>;
}

export function Header({ categories = [] }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { openCart, getItemCount, hasItems } = useCartStore();
  const itemCount = getItemCount();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const collectionsRef = useRef<HTMLLIElement>(null);
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

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsCollectionsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (collectionsRef.current && !collectionsRef.current.contains(e.target as Node)) {
        setIsCollectionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-[60] bg-[var(--som-cream)] border-b border-[var(--som-burgundy)]/10">
      {/* Top Row - Logo & Actions */}
      <div className="border-b border-[var(--som-burgundy)]/5">
        <div className="container-som h-[70px] grid grid-cols-3 items-center">
          {/* Left - Search */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Recherche"
              className="text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors p-2 -ml-2"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Center - Logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo_header.png"
                alt="SO'MAYA — La qualité, notre référence"
                width={180}
                height={45}
                className="h-[45px] w-auto"
                priority
              />
            </Link>
          </div>

          {/* Right - Cart */}
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={openCart}
              aria-label="Panier"
              className="relative text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors p-2 -mr-2"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {isMounted && hasItems() && (
                <span className="absolute top-0 right-0 bg-[var(--som-burgundy)] text-white text-[9px] font-semibold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row - Navigation (Desktop) */}
      <nav className="hidden md:block">
        <div className="container-som h-[50px] flex items-center justify-center">
          <ul className="flex items-center gap-8">
            <li>
              <Link
                href="/"
                className="font-[family-name:var(--font-body)] text-[11.5px] font-semibold tracking-[0.15em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors"
              >
                Accueil
              </Link>
            </li>

            {/* Collections Dropdown */}
            <li ref={collectionsRef} className="relative">
              <button
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                className="font-[family-name:var(--font-body)] text-[11.5px] font-semibold tracking-[0.15em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors flex items-center gap-1"
              >
                Collections
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${isCollectionsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isCollectionsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white shadow-xl border border-[var(--som-burgundy)]/10 min-w-[200px] py-2 z-50">
                  <Link
                    href="/catalogue"
                    onClick={() => setIsCollectionsOpen(false)}
                    className="block px-5 py-2.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--som-burgundy)] hover:bg-[#faf6f1] transition-colors"
                  >
                    Voir tout
                  </Link>
                  <div className="h-px bg-[var(--som-burgundy)]/10 my-1" />
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/catalogue/${category.slug}`}
                      onClick={() => setIsCollectionsOpen(false)}
                      className="block px-5 py-2.5 text-[11px] font-medium tracking-[0.08em] text-[var(--som-text)] hover:bg-[#faf6f1] hover:text-[var(--som-burgundy)] transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            <li>
              <Link
                href="/lots"
                className="font-[family-name:var(--font-body)] text-[11.5px] font-semibold tracking-[0.15em] uppercase text-[var(--som-burgundy)] hover:text-[var(--som-text)] transition-colors"
              >
                Par Budget
              </Link>
            </li>

            <li>
              <Link
                href="/a-propos"
                className="font-[family-name:var(--font-body)] text-[11.5px] font-semibold tracking-[0.15em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors"
              >
                Notre Histoire
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                className="font-[family-name:var(--font-body)] text-[11.5px] font-semibold tracking-[0.15em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden border-t border-[var(--som-burgundy)]/5">
        <div className="container-som h-[44px] flex items-center justify-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-2 text-[var(--som-text)]"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
            <span className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.15em] uppercase">
              Menu
            </span>
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/40"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-[var(--som-cream)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-3xl mx-auto px-5 py-8">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#511F29]/40" strokeWidth={1.5} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-14 pr-14 py-4 text-lg text-[#2a181d] bg-white border border-[#511F29]/20 focus:border-[#511F29] outline-none transition-all placeholder:text-[#511F29]/40"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#511F29]/50 hover:text-[#511F29] transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-[#511F29]/50 mt-3 text-center">
                  Appuyez sur Entrée pour rechercher • Échap pour fermer
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--som-cream)] border-t border-[var(--som-burgundy)]/10">
          <nav className="container-som py-6 flex flex-col gap-5">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.15em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors"
            >
              Accueil
            </Link>

            <div>
              <Link
                href="/catalogue"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.15em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors"
              >
                Collections
              </Link>
              {/* Mobile categories */}
              <div className="mt-3 pl-4 flex flex-col gap-2.5 border-l-2 border-[var(--som-burgundy)]/15">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/catalogue/${category.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-[family-name:var(--font-body)] text-[11px] font-medium tracking-[0.1em] uppercase text-[#94786b] hover:text-[var(--som-burgundy)] transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/lots"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.15em] uppercase text-[var(--som-burgundy)] hover:text-[var(--som-text)] transition-colors"
            >
              Par Budget
            </Link>

            <Link
              href="/a-propos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.15em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors"
            >
              Notre Histoire
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.15em] uppercase text-[var(--som-text)] hover:text-[var(--som-burgundy)] transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
