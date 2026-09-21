import Link from "next/link";
import { X } from "lucide-react";
import { SECONDARY_NAV, SHOP_SHORTCUTS } from "@/shared/config/navigation";
import type { NavCategory } from "./types";

export function MobileMenu({
  open,
  categories,
  onClose,
}: {
  open: boolean;
  categories: NavCategory[];
  onClose: () => void;
}) {
  const shopLinks = [
    ...SHOP_SHORTCUTS,
    ...categories.map((category) => ({ label: category.name, href: `/catalogue/${category.slug}` })),
  ];

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className={`fixed inset-0 z-[100] flex flex-col bg-white transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none md:hidden ${
        open ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-3 opacity-0"
      }`}
    >
      <div className="container-som flex h-16 items-center justify-between border-b border-[#ececec]">
        <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--som-gray)]">Menu</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le menu"
          className="-mr-3 flex h-11 w-11 cursor-pointer items-center justify-center text-[var(--som-ink)]"
        >
          <X size={21} strokeWidth={1.3} />
        </button>
      </div>

      <nav aria-label="Navigation mobile" className="flex-1 overflow-y-auto pb-10 pt-4">
        <div className="container-som">
          <p className="mb-1 mt-4 text-[11px] uppercase tracking-[0.22em] text-[var(--som-gray)]">Boutique</p>
          <ul className="m-0 list-none p-0">
            {shopLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex min-h-12 items-center text-[17px] font-light text-[var(--som-ink)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="m-0 mt-6 list-none border-t border-[#ececec] p-0 pt-4">
            {SECONDARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
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
  );
}
