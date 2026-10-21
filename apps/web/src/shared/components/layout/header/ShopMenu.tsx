import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SHOP_SHORTCUTS } from "@/shared/config/navigation";
import type { NavCategory } from "./types";

type ShopMenuProps = {
  open: boolean;
  categories: NavCategory[];
  isActive: (href: string) => boolean;
  onNavigate: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const sectionLabel = "m-0 mb-5 text-[10px] uppercase tracking-[0.28em] text-[#9a9a9a]";

export function ShopMenu({ open, categories, isActive, onNavigate, onMouseEnter, onMouseLeave }: ShopMenuProps) {
  const featured = categories.filter((category) => category.imageUrl).slice(0, 2);

  return (
    <>
      <div
        id="shop-panel"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        inert={!open}
        className={`absolute inset-x-0 top-full hidden border-t border-[#ececec] bg-white shadow-[0_18px_30px_-20px_rgba(0,0,0,0.18)] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none md:block ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="py-10">
          <div className="container-som grid grid-cols-[180px_1fr_auto] gap-12 lg:gap-16">
            <div>
              <p className={sectionLabel}>La boutique</p>
              <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {SHOP_SHORTCUTS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
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

            <div>
              <p className={sectionLabel}>Catégories</p>
              <ul className="m-0 grid list-none grid-cols-2 gap-x-12 gap-y-3 p-0">
                {categories.map((category) => {
                  const href = `/catalogue/${category.slug}`;
                  const active = isActive(href);
                  return (
                    <li key={category.id}>
                      <Link
                        href={href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={`inline-block text-[14px] transition-[color,transform] duration-200 hover:translate-x-1 hover:text-[var(--som-ink)] motion-reduce:hover:translate-x-0 ${
                          active ? "font-normal text-[var(--som-ink)]" : "font-light text-[#555]"
                        }`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {featured.length > 0 && (
              <ul className="m-0 hidden list-none gap-4 p-0 lg:flex">
                {featured.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/catalogue/${category.slug}`}
                      onClick={onNavigate}
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

      <div
        aria-hidden
        onClick={onNavigate}
        className={`absolute inset-x-0 top-full -z-10 hidden h-screen bg-black/15 transition-opacity duration-200 md:block ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
    </>
  );
}
