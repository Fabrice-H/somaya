"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { MAIN_NAV } from "@/shared/config/navigation";
import { HeaderActions } from "./header/HeaderActions";
import { MobileMenu } from "./header/MobileMenu";
import { NavLink, NavUnderline, navLinkClass } from "./header/NavLink";
import { SearchPanel } from "./header/SearchPanel";
import { ShopMenu } from "./header/ShopMenu";
import type { NavCategory } from "./header/types";
import { useHeaderPanels } from "./header/useHeaderPanels";

export function Header({ categories = [] }: { categories?: NavCategory[] }) {
  const { panel, pathname, show, close, toggle, hoverShop, leaveShop } = useHeaderPanels();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const isShopActive = pathname.startsWith("/catalogue");

  return (
    <header className="sticky top-0 z-[60] border-b border-[#ececec] bg-white">
      <div className="container-som grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-[72px]">
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
              <li onMouseEnter={hoverShop} onMouseLeave={leaveShop}>
                <button
                  type="button"
                  onClick={() => toggle("shop")}
                  aria-expanded={panel === "shop"}
                  aria-controls="shop-panel"
                  className={`${navLinkClass} cursor-pointer gap-1.5 ${isShopActive ? "text-[var(--som-ink)]" : ""}`}
                >
                  Boutique
                  <ChevronDown
                    size={13}
                    strokeWidth={1.5}
                    aria-hidden
                    className={`transition-transform duration-200 ${panel === "shop" ? "rotate-180" : ""}`}
                  />
                  <NavUnderline active={isShopActive} />
                </button>
              </li>
              {MAIN_NAV.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href} active={isActive(link.href)}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Link href="/" aria-label="SO'MAYA, accueil" className="flex items-center justify-self-center">
          <Image
            src="/images/logo_header.png"
            alt="SO'MAYA"
            width={1072}
            height={291}
            priority
            className="h-8 w-auto md:h-10"
          />
        </Link>

        <HeaderActions searchOpen={panel === "search"} onToggleSearch={() => toggle("search")} isActive={isActive} />
      </div>

      <ShopMenu
        open={panel === "shop"}
        categories={categories}
        isActive={isActive}
        onNavigate={close}
        onMouseEnter={hoverShop}
        onMouseLeave={leaveShop}
      />
      <SearchPanel open={panel === "search"} onClose={close} />
      <MobileMenu open={panel === "mobile"} categories={categories} onClose={close} />
    </header>
  );
}
