"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-CI", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(price) + " FCFA";
}

// Flexible product type that works with DB products
export interface ProductCardData {
  id: string;
  slug?: string;
  name: string;
  category?: string | { name: string; slug?: string } | null;
  price: number | string;
  oldPrice?: number | string | null;
  images?: string[] | null;
  image?: string;
  stock?: number;
  isBestseller?: boolean;
  isNew?: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
  index?: number;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Normalize data from DB formats
  const imageUrl = product.images?.[0] || product.image || "/images/placeholder.jpg";
  const categoryName = typeof product.category === "string"
    ? product.category
    : product.category?.name || "";
  const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
  const oldPrice = product.oldPrice
    ? (typeof product.oldPrice === "string" ? parseFloat(product.oldPrice) : product.oldPrice)
    : undefined;

  // Use slug if available, fallback to id
  const productUrl = `/produit/${product.slug || product.id}`;

  // Check if product is out of stock
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  // Determine badge
  const getBadge = () => {
    if (isOutOfStock) return { text: "Épuisé", style: "outofstock" as const };
    if (product.isNew) return { text: "Nouveau", style: "new" as const };
    if (product.isBestseller) return { text: "Best-seller", style: "bestseller" as const };
    return null;
  };
  const badge = getBadge();

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug || product.id,
      productImage: imageUrl,
      categoryName: categoryName,
      price: price,
      stock: product.stock ?? 999,
    });
  };

  return (
    <article style={{ position: "relative", width: "100%", minWidth: 0 }}>
      {/* Image Container */}
      <div
        className="group"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4/5",
          overflow: "hidden",
          background: "#ece0d3",
          borderRadius: "2px",
        }}
      >
        <Link href={productUrl} className="block" style={{ display: "block", height: "100%" }}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="transition-transform duration-700 group-hover:scale-[1.06]"
            style={{
              objectFit: "cover",
              objectPosition: "center 20%",
              cursor: "pointer",
            }}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </Link>

        {/* Badge */}
        {badge && (
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              background:
                badge.style === "outofstock"
                  ? "#6b6b6b"
                  : badge.style === "new"
                    ? "#2d5a3d"
                    : "#511F29",
              color:
                badge.style === "outofstock"
                  ? "#ffffff"
                  : badge.style === "new"
                    ? "#d4f5dc"
                    : "#fcd3b4",
              fontSize: "9.5px",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "6px 11px",
              borderRadius: "2px",
              pointerEvents: "none",
            }}
          >
            {badge.text}
          </div>
        )}

        {/* Add to Cart Button (on hover) */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="opacity-0 group-hover:opacity-100 hide-on-mobile transition-opacity duration-300"
          style={{
            position: "absolute",
            left: "14px",
            right: "14px",
            bottom: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: isOutOfStock ? "rgba(107,107,107,0.9)" : "rgba(81,31,41,0.95)",
            color: "#fbf3ec",
            fontFamily: "var(--font-sans), sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "13px 16px",
            border: "none",
            borderRadius: "2px",
            backdropFilter: "blur(4px)",
            cursor: isOutOfStock ? "not-allowed" : "pointer",
          }}
        >
          {isOutOfStock ? (
            "Indisponible"
          ) : (
            <>
              <ShoppingBag size={14} />
              Ajouter au panier
            </>
          )}
        </button>
      </div>

      {/* Product Info */}
      <div style={{ padding: "18px 2px 0" }}>
        {categoryName && (
          <div
            style={{
              fontSize: "10.5px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#94786b",
              marginBottom: "7px",
            }}
          >
            {categoryName}
          </div>
        )}
        <Link href={productUrl} style={{ textDecoration: "none" }}>
          <h3
            style={{
              fontFamily: "var(--font-serif), serif",
              fontWeight: 500,
              fontSize: "19px",
              margin: "0 0 9px",
              color: "#2a181d",
            }}
          >
            {product.name}
          </h3>
        </Link>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <span
            style={{
              fontSize: "14.5px",
              fontWeight: 600,
              color: "#511F29",
            }}
          >
            {formatPrice(price)}
          </span>
          {oldPrice && (
            <span
              style={{
                fontSize: "13px",
                color: "#b09a8d",
                textDecoration: "line-through",
              }}
            >
              {formatPrice(oldPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
