"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import type { HomePriceLot } from "@/lib/queries/home";
import { useCartStore } from "@/stores/cart-store";

// ============================================================
// Types
// ============================================================

interface PriceLotsSectionProps {
  lots: HomePriceLot[];
}

// ============================================================
// Helpers
// ============================================================

function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-CI").format(price) + " FCFA";
}

function formatShortPrice(price: number): string {
  if (price >= 1000) {
    const k = price / 1000;
    return k === Math.floor(k) ? `${k}k` : `${Math.round(k)}k`;
  }
  return `${price}`;
}

// ============================================================
// Client Component - PriceLotsSection
// Shows price lots on the home page with "Par Budget" header
// ============================================================

export function PriceLotsSection({ lots }: PriceLotsSectionProps) {
  // Don't render if no lots
  if (!lots || lots.length === 0) {
    return null;
  }

  // Get unique prices for quick filter display
  const uniquePrices = [...new Set(lots.map((lot) => lot.price))].sort((a, b) => a - b);

  return (
    <section className="bg-[#faf6f1] py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
          <div>
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#94786b] mb-2 block">
              Trouvez votre budget
            </span>
            <h2 className="font-serif font-normal text-[28px] md:text-[36px] lg:text-[42px] text-[#2a181d] leading-[1.1] tracking-tight">
              Par Budget
            </h2>
          </div>

          {/* Price Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {uniquePrices.slice(0, 5).map((price) => (
              <Link
                key={price}
                href={`/lots?price=${price}`}
                className="px-4 py-2 rounded-full text-sm font-medium bg-[#511F29]/5 text-[#511F29] hover:bg-[#511F29] hover:text-white transition-all"
              >
                {formatShortPrice(price)} FCFA
              </Link>
            ))}
            <Link
              href="/lots"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#511F29] text-white hover:bg-[#3d171f] transition-all"
            >
              Voir tout
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Lots Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {lots.slice(0, 8).map((lot) => (
            <PriceLotCard key={lot.id} lot={lot} />
          ))}
        </div>

        {/* View All Button (Mobile) */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/lots"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#511F29] text-white rounded-full font-medium hover:bg-[#3d171f] transition-colors"
          >
            Voir tous les lots
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Price Lot Card Component
// ============================================================

interface PriceLotCardProps {
  lot: HomePriceLot;
}

function PriceLotCard({ lot }: PriceLotCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Get first item for display
  const firstItem = lot.items[0];
  const isOutOfStock = lot.totalStock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstItem || isOutOfStock) return;

    addItem({
      productId: `lot-${lot.id}`,
      productName: firstItem.label || lot.name,
      productSlug: `lot-${lot.id}`,
      productImage: firstItem.image,
      categoryName: lot.category?.name || "",
      price: lot.price,
      stock: firstItem.stock,
      lotId: lot.id,
      lotName: lot.name,
      lotPrice: lot.price,
      lotStock: firstItem.stock,
      itemId: firstItem.id,
      itemLabel: firstItem.label,
    });
  };

  if (!firstItem) return null;

  return (
    <Link href={`/lots?price=${lot.price}`} className="group block">
      {/* Image Container */}
      <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-[#ece0d3] mb-3">
        <Image
          src={firstItem.image}
          alt={firstItem.label || lot.name}
          fill
          className={`object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105 ${
            isOutOfStock ? "grayscale" : ""
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Price Badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1.5 rounded text-xs font-semibold tracking-wider uppercase ${
            isOutOfStock
              ? "bg-gray-500 text-white"
              : "bg-[#511F29] text-[#fcd3b4]"
          }`}
        >
          {isOutOfStock ? "Épuisé" : formatShortPrice(lot.price)}
        </div>

        {/* Items Count Badge */}
        {lot.totalItems > 1 && !isOutOfStock && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-white/90 backdrop-blur-sm text-xs font-medium text-[#511F29]">
            {lot.totalItems} articles
          </div>
        )}

        {/* Add to Cart (hover) */}
        {!isOutOfStock && (
          <button
            onClick={handleAddToCart}
            className="absolute left-3 right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 bg-[#511F29]/95 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded backdrop-blur-sm hover:bg-[#511F29] hidden md:flex"
          >
            <ShoppingBag size={14} />
            Ajouter
          </button>
        )}
      </div>

      {/* Info */}
      <div className="px-1">
        {lot.category && (
          <span className="text-[10px] tracking-[0.16em] uppercase text-[#94786b] block mb-1">
            {lot.category.name}
          </span>
        )}
        <h3 className="font-serif text-[17px] text-[#2a181d] mb-1 line-clamp-1">
          {lot.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-[14px] font-semibold text-[#511F29]">
            {formatPrice(lot.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default PriceLotsSection;
