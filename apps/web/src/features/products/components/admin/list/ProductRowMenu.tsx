"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Eye, EyeOff, MoreHorizontal, Trash2 } from "lucide-react";
import type { Product } from "@/features/products/types";

const MENU_HEIGHT = 140;
const ITEM_CLASS =
  "flex h-10 w-full cursor-pointer items-center gap-3 px-4 text-left text-[13px] text-[var(--som-ink)] transition-colors hover:bg-[var(--som-surface-alt)] focus-visible:bg-[var(--som-surface-alt)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

type Position = { top: number; right: number };

interface ProductRowMenuProps {
  product: Pick<Product, "slug" | "name" | "is_active">;
  busy: boolean;
  onToggleVisibility: () => void;
  onDelete: () => void;
}

export function ProductRowMenu({ product, busy, onToggleVisibility, onDelete }: ProductRowMenuProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!position) return;
    const close = () => setPosition(null);
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) close();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      buttonRef.current?.focus();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [position]);

  const toggle = () => {
    if (position || !buttonRef.current) return setPosition(null);
    const rect = buttonRef.current.getBoundingClientRect();
    const openUp = rect.bottom + MENU_HEIGHT > window.innerHeight;
    setPosition({ top: openUp ? rect.top - MENU_HEIGHT - 4 : rect.bottom + 4, right: window.innerWidth - rect.right });
  };

  const run = (action: () => void) => () => {
    setPosition(null);
    action();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={Boolean(position)}
        aria-label={`Plus d'actions pour ${product.name}`}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border border-[var(--som-border)] bg-white text-[var(--som-ink)] transition-colors hover:border-[var(--som-border-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--som-primary)]"
      >
        <MoreHorizontal size={17} strokeWidth={1.5} aria-hidden />
      </button>
      {position && (
        <div
          ref={menuRef}
          role="menu"
          style={{ top: position.top, right: position.right }}
          className="fixed z-40 w-56 border border-[var(--som-border)] bg-white py-1 shadow-[0_18px_30px_-20px_rgba(0,0,0,0.18)]"
        >
          <Link
            href={`/produit/${product.slug}`}
            target="_blank"
            role="menuitem"
            onClick={() => setPosition(null)}
            className={ITEM_CLASS}
          >
            <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden />
            Voir en boutique
          </Link>
          <button
            type="button"
            role="menuitem"
            disabled={busy}
            onClick={run(onToggleVisibility)}
            className={ITEM_CLASS}
          >
            {product.is_active ? (
              <EyeOff size={15} strokeWidth={1.5} aria-hidden />
            ) : (
              <Eye size={15} strokeWidth={1.5} aria-hidden />
            )}
            {product.is_active ? "Masquer de la boutique" : "Remettre en ligne"}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={run(onDelete)}
            className={`${ITEM_CLASS} !text-[var(--som-error)] hover:!bg-[var(--som-error-tint)]`}
          >
            <Trash2 size={15} strokeWidth={1.5} aria-hidden />
            Supprimer
          </button>
        </div>
      )}
    </>
  );
}
