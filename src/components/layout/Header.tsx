"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  Gift,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";

interface HeaderProps {
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
  }>;
}

type Panel = "shop" | "search" | "mobile" | null;

// true only on the client, avoids cart badge hydration mismatch
const subscribeNoop = () => () => {};
function useHasMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

const linkClass =
  "group relative inline-flex h-11 items-center text-[12px] font-normal uppercase tracking-[0.16em] text-[#555] transition-colors duration-200 hover:text-[var(--som-ink)]";

// Thin line sliding in under a nav link
function Underline({ active = false }: { active?: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute bottom-2 left-0 h-px w-full origin-left bg-[var(--som-primary)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  );
}

export function Header({ categories = [] }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const hasMounted = useHasMounted();
  const openCart = useCartStore((state) => state.openCart);
  const itemCount = useCartStore((state) => state.getItemCount());

  // Panel is tied to the route it was opened on: navigating closes it
  const [openPanel, setOpenPanel] = useState<{ panel: Panel; path: string }>({
    panel: null,
    path: "",
  });
  const panel = openPanel.path === pathname ? openPanel.panel : null;
  const show = (next: Panel) => setOpenPanel({ panel: next, path: pathname });
  const close = () => setOpenPanel({ panel: null, path: pathname });

  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const shopCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isShopActive = pathname.startsWith("/catalogue");
  // Two visuals in the shop panel: first categories that have a photo
  const featuredCategories = categories.filter((c) => c.imageUrl).slice(0, 2);
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Escape closes any panel; the mobile drawer also locks page scroll
  useEffect(() => {
    if (!panel) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPanel({ panel: null, path: "" });
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    if (panel === "mobile") document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [panel]);

  useEffect(() => {
    if (panel === "search") searchInputRef.current?.focus();
  }, [panel]);

  // Hover intent for the shop dropdown (small delay so it doesn't flicker)
  const openShop = () => {
    if (shopCloseTimer.current) clearTimeout(shopCloseTimer.current);
    show("shop");
  };
  const scheduleCloseShop = () => {
    shopCloseTimer.current = setTimeout(() => {
      setOpenPanel((current) =>
        current.panel === "shop" ? { panel: null, path: "" } : current,
      );
    }, 150);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/catalogue?q=${encodeURIComponent(q)}`);
    setQuery("");
    close();
  };

  const cartLabel =
    hasMounted && itemCount > 0
      ? `Panier, ${itemCount} article${itemCount > 1 ? "s" : ""}`
      : "Panier";

  return (
    <header className="sticky top-0 z-[60] border-b border-[#ececec] bg-white">
      <div className="container-som grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-[72px]">
        {/* Left */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => show("mobile")}
            aria-label="Ouvrir le menu"
            aria-expanded={panel === "mobile"}
            aria-controls="mobile-menu"
            className="-ml-3 flex h-11 w-11 cursor-pointer items-center justify-center text-[var(--som-ink)] md:hidden"
          >
            <Menu size={21} strokeWidth={1.3} />
          </button>

          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul className="m-0 flex list-none items-center gap-7 p-0 lg:gap-9">
              <li onMouseEnter={openShop} onMouseLeave={scheduleCloseShop}>
                <button
                  type="button"
                  onClick={() => (panel === "shop" ? close() : show("shop"))}
                  aria-expanded={panel === "shop"}
                  aria-controls="shop-panel"
                  className={`${linkClass} cursor-pointer gap-1.5 ${isShopActive ? "text-[var(--som-ink)]" : ""}`}
                >
                  Boutique
                  <ChevronDown
                    size={13}
                    strokeWidth={1.5}
                    aria-hidden
                    className={`transition-transform duration-200 ${panel === "shop" ? "rotate-180" : ""}`}
                  />
                  <Underline active={isShopActive} />
                </button>
              </li>
              <li>
                <Link
                  href="/lots"
                  aria-current={isActive("/lots") ? "page" : undefined}
                  className={linkClass}
                >
                  Par budget
                  <Underline active={isActive("/lots")} />
                </Link>
              </li>
              <li>
                <Link
                  href="/a-propos"
                  aria-current={isActive("/a-propos") ? "page" : undefined}
                  className={linkClass}
                >
                  La marque
                  <Underline active={isActive("/a-propos")} />
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Logo */}
        <Link
          href="/"
          aria-label="SO'MAYA, accueil"
          className="flex items-center justify-self-center"
        >
          <Image
            src="/images/logo_header.png"
            alt="SO'MAYA"
            width={1072}
            height={291}
            priority
            className="h-8 w-auto md:h-10"
          />
        </Link>

        {/* Right */}
        <div className="flex items-center justify-end md:gap-2 lg:gap-3">
          <button
            type="button"
            onClick={() => (panel === "search" ? close() : show("search"))}
            aria-label="Rechercher"
            aria-expanded={panel === "search"}
            aria-controls="search-panel"
            className="flex h-11 w-11 cursor-pointer items-center justify-center text-[var(--som-ink)] transition-opacity hover:opacity-60"
          >
            <Search size={19} strokeWidth={1.4} />
          </button>
          <Link
            href="/contact"
            aria-current={isActive("/contact") ? "page" : undefined}
            className={`${linkClass} mr-2 hidden lg:inline-flex`}
          >
            Contact
            <Underline active={isActive("/contact")} />
          </Link>
          <Link
            href="/fidelite"
            aria-label="Programme fidélité"
            title="Programme fidélité"
            aria-current={isActive("/fidelite") ? "page" : undefined}
            className="hidden h-11 w-11 items-center justify-center text-[var(--som-ink)] transition-opacity hover:opacity-60 md:flex"
          >
            <Gift size={19} strokeWidth={1.4} />
          </Link>
          <Link
            href="/compte"
            aria-label="Mon compte"
            title="Mon compte"
            aria-current={isActive("/compte") ? "page" : undefined}
            className="hidden h-11 w-11 items-center justify-center text-[var(--som-ink)] transition-opacity hover:opacity-60 sm:flex"
          >
            <User size={20} strokeWidth={1.4} />
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={cartLabel}
            className="relative -mr-3 flex h-11 w-11 cursor-pointer items-center justify-center text-[var(--som-ink)] transition-opacity hover:opacity-60"
          >
            <ShoppingBag size={20} strokeWidth={1.4} />
            {hasMounted && itemCount > 0 && (
              <span
                aria-hidden
                className="absolute right-1 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--som-accent)] px-1 text-[9.5px] font-semibold tabular-nums text-white"
              >
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Shop dropdown (desktop) */}
      <div
        id="shop-panel"
        onMouseEnter={openShop}
        onMouseLeave={scheduleCloseShop}
        inert={panel !== "shop"}
        className={`absolute inset-x-0 top-full hidden border-t border-[#ececec] bg-white shadow-[0_18px_30px_-20px_rgba(0,0,0,0.18)] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none md:block ${
          panel === "shop"
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {/* .container-som resets padding, so vertical spacing lives on this wrapper */}
        <div className="py-10">
          <div className="container-som grid grid-cols-[180px_1fr_auto] gap-12 lg:gap-16">
            {/* Shortcuts */}
            <div>
              <p className="m-0 mb-5 text-[10px] uppercase tracking-[0.28em] text-[#9a9a9a]">
                La boutique
              </p>
              <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {[
                  { label: "Nouveautés", href: "/#nouveautes" },
                  { label: "Toute la boutique", href: "/catalogue" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className="group/item inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--som-ink)]"
                    >
                      {item.label}
                      <ArrowRight
                        size={13}
                        strokeWidth={1.5}
                        aria-hidden
                        className="-translate-x-1 opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <p className="m-0 mb-5 text-[10px] uppercase tracking-[0.28em] text-[#9a9a9a]">
                Catégories
              </p>
              <ul className="m-0 grid list-none grid-cols-2 gap-x-12 gap-y-3 p-0">
                {categories.map((category) => {
                  const href = `/catalogue/${category.slug}`;
                  const active = isActive(href);
                  return (
                    <li key={category.id}>
                      <Link
                        href={href}
                        onClick={close}
                        aria-current={active ? "page" : undefined}
                        className={`inline-block text-[14px] transition-[color,transform] duration-200 hover:translate-x-1 hover:text-[var(--som-ink)] motion-reduce:hover:translate-x-0 ${
                          active
                            ? "font-normal text-[var(--som-ink)]"
                            : "font-light text-[#555]"
                        }`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Visuals */}
            {featuredCategories.length > 0 && (
              <ul className="m-0 hidden list-none gap-4 p-0 lg:flex">
                {featuredCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/catalogue/${category.slug}`}
                      onClick={close}
                      className="group/tile block w-[170px]"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--som-surface)]">
                        <Image
                          src={category.imageUrl!}
                          alt=""
                          fill
                          sizes="170px"
                          className="object-cover transition-transform duration-700 ease-out group-hover/tile:scale-[1.04] motion-reduce:transition-none"
                        />
                      </div>
                      <span className="mt-3 block text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--som-ink)]">
                        {category.name}
                      </span>
                      <span className="mt-0.5 inline-block border-b border-[#bbb] text-[10px] uppercase tracking-[0.2em] text-[var(--som-gray)]">
                        Découvrir
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Soft scrim under the open shop panel */}
      <div
        aria-hidden
        onClick={close}
        className={`absolute inset-x-0 top-full -z-10 hidden h-screen bg-black/15 transition-opacity duration-200 md:block ${
          panel === "shop" ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Search bar */}
      <div
        id="search-panel"
        inert={panel !== "search"}
        className={`absolute inset-x-0 top-full border-b border-t border-[#ececec] bg-white transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${
          panel === "search"
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="py-4">
          <form
            role="search"
            onSubmit={handleSearch}
            className="container-som flex items-center gap-3"
          >
            <Search
              size={18}
              strokeWidth={1.4}
              aria-hidden
              className="shrink-0 text-[var(--som-gray)]"
            />
            <label htmlFor="header-search" className="sr-only">
              Rechercher un produit
            </label>
            <input
              ref={searchInputRef}
              id="header-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit, une catégorie…"
              autoComplete="off"
              className="h-11 flex-1 bg-transparent text-[16px] font-light text-[var(--som-ink)] outline-none placeholder:text-[#9a9a9a] md:text-[17px]"
            />
            <button
              type="button"
              onClick={close}
              aria-label="Fermer la recherche"
              className="-mr-3 flex h-11 w-11 cursor-pointer items-center justify-center text-[var(--som-gray)] hover:text-[var(--som-ink)]"
            >
              <X size={18} strokeWidth={1.4} />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={panel !== "mobile"}
        className={`fixed inset-0 z-[100] flex flex-col bg-white transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none md:hidden ${
          panel === "mobile"
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-3 opacity-0"
        }`}
      >
        <div className="container-som flex h-16 items-center justify-between border-b border-[#ececec]">
          <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--som-gray)]">
            Menu
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Fermer le menu"
            className="-mr-3 flex h-11 w-11 cursor-pointer items-center justify-center text-[var(--som-ink)]"
          >
            <X size={21} strokeWidth={1.3} />
          </button>
        </div>

        <nav
          aria-label="Navigation mobile"
          className="flex-1 overflow-y-auto pb-10 pt-4"
        >
          <div className="container-som">
            <p className="mb-1 mt-4 text-[11px] uppercase tracking-[0.22em] text-[var(--som-gray)]">
              Boutique
            </p>
            <ul className="m-0 list-none p-0">
              {[
                { label: "Nouveautés", href: "/#nouveautes" },
                { label: "Toute la boutique", href: "/catalogue" },
                ...categories.map((c) => ({
                  label: c.name,
                  href: `/catalogue/${c.slug}`,
                })),
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="flex min-h-12 items-center text-[17px] font-light text-[var(--som-ink)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="m-0 mt-6 list-none border-t border-[#ececec] p-0 pt-4">
              {[
                { label: "Par budget", href: "/lots" },
                { label: "Programme fidélité", href: "/fidelite" },
                { label: "Mon compte", href: "/compte" },
                { label: "La marque", href: "/a-propos" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="flex min-h-12 items-center text-[13px] uppercase tracking-[0.16em] text-[var(--som-ink)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
