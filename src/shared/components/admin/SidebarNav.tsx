"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { ADMIN_NAVIGATION } from "./constants";

const isActiveLink = (pathname: string, href: string) =>
  pathname === href || (href !== "/admin" && pathname.startsWith(href));

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[72px] shrink-0 flex-col justify-center border-b border-white/10 px-6">
        <Link href="/admin" onClick={onNavigate} aria-label="Tableau de bord">
          <Image
            src="/images/logo_header.png"
            alt="SO'MAYA"
            width={1072}
            height={291}
            className="h-7 w-auto"
            priority
          />
        </Link>
        <span className="mt-1 text-[10px] uppercase tracking-[0.28em] text-white/50">Administration</span>
      </div>

      <nav aria-label="Administration" className="flex-1 overflow-y-auto px-3 py-6">
        {ADMIN_NAVIGATION.map((group) => (
          <div key={group.label} className="mb-6 last:mb-0">
            <p className="m-0 mb-2 px-3 text-[10px] uppercase tracking-[0.24em] text-white/40">{group.label}</p>
            <ul className="m-0 list-none p-0">
              {group.items.map(({ name, href, icon: Icon }) => {
                const active = isActiveLink(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex h-10 items-center gap-3 px-3 text-[13px] transition-colors ${
                        active
                          ? "bg-white/10 font-medium text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {active && (
                        <span aria-hidden className="absolute inset-y-2 left-0 w-[2px] bg-[var(--som-accent)]" />
                      )}
                      <Icon size={17} strokeWidth={1.5} aria-hidden />
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 px-3 py-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 items-center gap-3 px-3 text-[13px] text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={17} strokeWidth={1.5} aria-hidden />
          Voir la boutique
        </a>
        <div className="mt-3 flex items-center justify-between gap-2 px-3">
          <div className="min-w-0">
            <p className="m-0 truncate text-[12px] text-white">{session?.user?.name || "Administrateur"}</p>
            <p className="m-0 truncate text-[11px] font-light text-white/55">{session?.user?.email}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            aria-label="Déconnexion"
            title="Déconnexion"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={17} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
