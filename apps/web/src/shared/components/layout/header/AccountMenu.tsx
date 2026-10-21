"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ChevronDown, LogOut, Package, User, UserRound } from "lucide-react";
import { customerLogoutAction } from "@/features/account/server/actions";
import { ACCOUNT_LOGIN_PATH, ACCOUNT_ORDERS_PATH, ACCOUNT_PROFILE_PATH } from "@/features/account/constants";

const iconButton =
  "h-11 w-11 cursor-pointer items-center justify-center text-[var(--som-ink)] transition-opacity hover:opacity-60";

export function AccountMenu({ isActive }: { isActive: (href: string) => boolean }) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const customer = session?.user?.role === "customer" ? session.user : null;

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!customer) {
    return (
      <Link
        href={status === "loading" ? "/compte" : ACCOUNT_LOGIN_PATH}
        aria-label="Mon compte"
        title="Mon compte"
        aria-current={isActive("/compte") ? "page" : undefined}
        className={`${iconButton} hidden sm:flex`}
      >
        <User size={20} strokeWidth={1.4} />
      </Link>
    );
  }

  const name = customer.name?.trim() || "";
  const initial = name ? name[0].toUpperCase() : "I";
  const label = name ? `Bonjour ${name}` : "Compte invité";

  return (
    <div ref={rootRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Mon compte"
        className="flex h-11 cursor-pointer items-center gap-1.5 pl-1 pr-1 text-[var(--som-ink)]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--som-primary-50)] text-[13px] font-medium text-[var(--som-primary)]">
          {initial}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        role="menu"
        aria-hidden={!open}
        className={`absolute right-0 top-full z-[70] mt-2 w-[268px] border border-[var(--som-border)] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-[opacity,transform] duration-200 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <p className="m-0 border-b border-[var(--som-border)] px-5 py-4 text-[14px] font-medium text-[var(--som-ink)]">
          {label}
        </p>
        <Link
          href={ACCOUNT_ORDERS_PATH}
          role="menuitem"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[var(--som-ink)] hover:bg-[var(--som-surface)]"
        >
          <Package size={15} strokeWidth={1.5} aria-hidden />
          Mes commandes
        </Link>
        <Link
          href={ACCOUNT_PROFILE_PATH}
          role="menuitem"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[var(--som-ink)] hover:bg-[var(--som-surface)]"
        >
          <UserRound size={15} strokeWidth={1.5} aria-hidden />
          {customer.guest ? "Sécuriser mon compte" : "Mon profil"}
        </Link>
        <button
          type="button"
          role="menuitem"
          disabled={isPending}
          onClick={() => startTransition(() => customerLogoutAction())}
          className="flex w-full cursor-pointer items-center gap-3 border-t border-[var(--som-border)] px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[var(--som-error)] hover:bg-[var(--som-surface)] disabled:opacity-60"
        >
          <LogOut size={15} strokeWidth={1.5} aria-hidden />
          {isPending ? "Déconnexion…" : "Déconnexion"}
        </button>
      </div>
    </div>
  );
}
