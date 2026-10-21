import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import { MOBILE_NAV_AFTER, MOBILE_NAV_BEFORE } from "@/shared/config/navigation";
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
  const links = [
    ...MOBILE_NAV_BEFORE,
    ...categories.map((category) => ({ label: category.name, href: `/catalogue/${category.slug}` })),
    ...MOBILE_NAV_AFTER,
  ];

  const mounted = useSyncExternalStore(subscribeNever, isClient, isServer);
  if (!mounted) return null;

  return createPortal(
    <div
      inert={!open}
      className={`fixed inset-0 z-[100] md:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Fermer le menu"
        onClick={onClose}
        className={`absolute inset-0 cursor-default bg-black/45 transition-opacity duration-300 motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute inset-y-0 left-0 flex w-[84%] max-w-[380px] flex-col bg-white transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
          open ? "translate-x-0 shadow-[8px_0_32px_rgba(0,0,0,0.12)]" : "-translate-x-full shadow-none"
        }`}
      >
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-[#e6e6e6] pl-6 pr-3">
          <Link
            href="/"
            onClick={onClose}
            className="text-[22px] font-light uppercase tracking-[0.04em] text-[var(--som-ink)]"
          >
            SO&apos;MAYA
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="flex h-11 w-11 cursor-pointer items-center justify-center text-[var(--som-ink)]"
          >
            <X size={22} strokeWidth={1.3} />
          </button>
        </div>

        <nav aria-label="Navigation mobile" className="flex-1 overflow-y-auto px-6 pb-10 pt-3">
          <ul className="m-0 list-none p-0">
            {links.map((item) => (
              <li key={item.href} className="border-b border-[#e6e6e6]">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex min-h-[64px] items-center text-[13.5px] uppercase tracking-[0.2em] text-[var(--som-ink)] transition-colors active:text-[var(--som-primary)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>,
    document.body
  );
}

const subscribeNever = () => () => {};
const isClient = () => true;
const isServer = () => false;
