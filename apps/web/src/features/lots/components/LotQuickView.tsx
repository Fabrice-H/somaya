"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ShoppingBag, X } from "lucide-react";
import { useModalBehavior } from "@/shared/hooks/useModalBehavior";
import { formatPrice } from "@/shared/lib/format";
import type { FlatLotItem } from "../types";
import { lotItemName } from "../utils";

export function LotQuickView({ flat, onClose, onAdd }: { flat: FlatLotItem; onClose: () => void; onAdd: () => void }) {
  const { item, lot } = flat;
  const [added, setAdded] = useState(false);
  const isOutOfStock = item.stock <= 0;
  useModalBehavior(true, onClose);

  const handleAdd = () => {
    if (isOutOfStock || added) return;
    onAdd();
    setAdded(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center md:items-center md:p-6">
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-black/40 animate-fade-in" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quickview-title"
        className="relative flex max-h-[92vh] w-full max-w-[880px] flex-col overflow-y-auto bg-white animate-fade-in md:flex-row"
      >
        <div className="relative aspect-[3/4] w-full shrink-0 bg-[var(--som-primary-50)] md:w-1/2">
          <Image
            src={item.image}
            alt={lotItemName(flat)}
            fill
            className={`object-cover ${isOutOfStock ? "opacity-55" : ""}`}
            sizes="(max-width: 768px) 100vw, 440px"
          />
        </div>

        <div className="flex flex-1 flex-col p-6 md:p-10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-2 top-2 flex h-11 w-11 cursor-pointer items-center justify-center bg-white/80 text-[var(--som-ink)] md:bg-transparent"
          >
            <X size={20} strokeWidth={1.4} />
          </button>

          {lot.category && (
            <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-[var(--som-gray)]">{lot.category.name}</p>
          )}
          <h2 id="quickview-title" className="m-0 mt-2 text-[22px] font-medium text-[var(--som-ink)] md:text-[26px]">
            {lotItemName(flat)}
          </h2>
          {item.label && <p className="m-0 mt-1 text-[14px] font-light text-[var(--som-gray)]">{lot.name}</p>}

          <p className="m-0 mt-5 text-[20px] text-[var(--som-ink)] tabular-nums">{formatPrice(lot.price)}</p>

          <p className="m-0 mt-4 flex items-center gap-2 text-[13px] text-[var(--som-gray)]">
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${
                isOutOfStock ? "bg-[#9a9a9a]" : item.stock > 3 ? "bg-[var(--som-success)]" : "bg-[var(--som-accent)]"
              }`}
            />
            {isOutOfStock ? "Épuisé" : item.stock > 3 ? "En stock" : `Plus que ${item.stock} en stock`}
          </p>

          <div className="mt-8 md:mt-auto md:pt-10">
            <button type="button" onClick={handleAdd} disabled={isOutOfStock} className="btn-primary w-full">
              {added ? (
                <>
                  <Check size={16} strokeWidth={1.8} aria-hidden /> Ajouté au panier
                </>
              ) : isOutOfStock ? (
                "Article épuisé"
              ) : (
                <>
                  <ShoppingBag size={16} strokeWidth={1.5} aria-hidden /> Ajouter au panier
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
