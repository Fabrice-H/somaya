"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { ADMIN_NAVIGATION } from "./constants";

const isActiveLink = (pathname: string, href: string) =>
  pathname === href || (href !== "/admin" && pathname.startsWith(href));

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="h-16 flex items-center justify-center border-b border-[#511f29]/10">
        <Link href="/admin" className="text-xl font-serif text-[#3c161e]">
          SO&apos;MAYA
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {ADMIN_NAVIGATION.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            onClick={onNavigate}
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActiveLink(pathname, href)
                ? "bg-[#511f29] text-white"
                : "text-[#3c161e]/70 hover:bg-[#511f29]/5 hover:text-[#3c161e]"
            )}
          >
            <Icon size={20} />
            {name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#511f29]/10">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#3c161e]/70 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut size={20} />
          Deconnexion
        </button>
      </div>
    </>
  );
}
