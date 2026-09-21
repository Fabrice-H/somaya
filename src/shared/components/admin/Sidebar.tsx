"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useModalBehavior } from "@/shared/hooks/useModalBehavior";
import { SidebarNav } from "./SidebarNav";

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);
  useModalBehavior(mobileOpen, close);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 grid h-14 grid-cols-[44px_1fr_44px] items-center border-b border-[var(--som-border)] bg-white px-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={mobileOpen}
          className="flex h-11 w-11 cursor-pointer items-center justify-center text-[var(--som-ink)]"
        >
          <Menu size={21} strokeWidth={1.4} />
        </button>
        <Link href="/admin" className="justify-self-center" aria-label="Tableau de bord">
          <Image src="/images/logo_header.png" alt="SO'MAYA" width={1072} height={291} className="h-6 w-auto" />
        </Link>
      </div>

      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        inert={!mobileOpen}
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Fermer le menu"
          className="absolute right-2 top-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center text-[var(--som-gray)] hover:text-[var(--som-ink)]"
        >
          <X size={19} strokeWidth={1.4} />
        </button>
        <SidebarNav onNavigate={close} />
      </aside>

      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[var(--som-border)] bg-white lg:block">
        <SidebarNav />
      </aside>
    </>
  );
}
