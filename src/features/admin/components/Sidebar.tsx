"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Star,
  Layers,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import clsx from "clsx";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Produits", href: "/admin/produits", icon: Package },
  { name: "Lots de Prix", href: "/admin/lots", icon: Layers },
  { name: "Categories", href: "/admin/categories", icon: FolderOpen },
  { name: "Collection Vedette", href: "/admin/collection-vedette", icon: Star },
  { name: "À Propos", href: "/admin/about-collections", icon: Users },
  { name: "Commandes", href: "/admin/commandes", icon: ShoppingCart },
  { name: "Reglages", href: "/admin/reglages", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-[#511F29]/10">
        <Link href="/admin" className="text-xl font-serif text-[#511F29]">
          SO&apos;MAYA
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#511F29] text-white"
                  : "text-[#511F29]/70 hover:bg-[#511F29]/5 hover:text-[#511F29]"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#511F29]/10">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                   text-[#511F29]/70 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut size={20} />
          Deconnexion
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#511F29]/10 z-40 flex items-center px-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-[#511F29] hover:bg-[#511F29]/5 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <span className="ml-4 text-lg font-serif text-[#511F29]">
          SO&apos;MAYA
        </span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={clsx(
          "lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col transform transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 text-[#511F29]/50 hover:text-[#511F29]"
        >
          <X size={20} />
        </button>
        <NavContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[#511F29]/10">
        <NavContent />
      </div>
    </>
  );
}
