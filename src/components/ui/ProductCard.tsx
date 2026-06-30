"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { type Product, formatPrice, getWhatsAppLink } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group">
      {/* Image Container */}
      <Link href={`/produit/${product.id}`} className="block relative">
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--som-cream)]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span
                className="px-3 py-1.5 text-[9.5px] font-semibold tracking-[0.14em] uppercase"
                style={{
                  backgroundColor: "var(--som-burgundy)",
                  color: "var(--som-peach)",
                }}
              >
                Nouveau
              </span>
            )}
            {product.oldPrice && (
              <span
                className="px-3 py-1.5 text-[9.5px] font-semibold tracking-[0.14em] uppercase"
                style={{
                  backgroundColor: "var(--som-text)",
                  color: "var(--som-cream)",
                }}
              >
                Solde
              </span>
            )}
            {product.isBestseller && (
              <span
                className="px-3 py-1.5 text-[9.5px] font-semibold tracking-[0.14em] uppercase"
                style={{
                  backgroundColor: "var(--som-burgundy)",
                  color: "var(--som-peach)",
                }}
              >
                Best-seller
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[var(--som-burgundy)] hover:text-white transition-colors shadow-sm"
              aria-label="Ajouter aux favoris"
            >
              <Heart className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[var(--som-burgundy)] hover:text-white transition-colors shadow-sm"
              aria-label="Aperçu rapide"
            >
              <Eye className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Add to Cart Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(getWhatsAppLink(product), "_blank", "noopener,noreferrer");
              }}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Commander</span>
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4">
        <Link href={`/produit/${product.id}`}>
          <h3
            className="font-[family-name:var(--font-playfair-display)] text-lg transition-colors"
            style={{ color: "var(--som-text)" }}
          >
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--som-burgundy)" }}
          >
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span
              className="text-sm line-through"
              style={{ color: "var(--som-text-muted)" }}
            >
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
