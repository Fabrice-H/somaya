"use client";

import { useState } from "react";
import clsx from "clsx";
import { Menu, X } from "lucide-react";
import { SidebarNav } from "./SidebarNav";

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#511f29]/10 z-40 flex items-center px-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
          className="p-2 text-[#3c161e] hover:bg-[#511f29]/5 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <span className="ml-4 text-lg font-serif text-[#3c161e]">SO&apos;MAYA</span>
      </div>

      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={close} />}

      <div
        className={clsx(
          "lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col transform transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Fermer le menu"
          className="absolute top-4 right-4 p-2 text-[#3c161e]/50 hover:text-[#3c161e]"
        >
          <X size={20} />
        </button>
        <SidebarNav onNavigate={close} />
      </div>

      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[#511f29]/10">
        <SidebarNav />
      </div>
    </>
  );
}
