"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACCOUNT_NAV } from "../constants";

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Espace client" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
      <ul className="m-0 flex list-none gap-6 p-0 lg:flex-col lg:gap-1">
        {ACCOUNT_NAV.map((item) => {
          const active = item.href === "/compte" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-10 shrink-0 items-center whitespace-nowrap text-[12px] uppercase tracking-[0.18em] transition-colors lg:border-l-2 lg:pl-4 ${
                  active
                    ? "text-[var(--som-ink)] lg:border-[var(--som-primary)]"
                    : "text-[var(--som-gray)] hover:text-[var(--som-ink)] lg:border-transparent"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
