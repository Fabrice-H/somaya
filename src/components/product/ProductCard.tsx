"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import type { HomePageProduct } from "@/lib/queries/home";
import { useCartStore } from "@/stores/cart-store";

// ============================================================
// Types
// ============================================================

interface ProductCardProps {
  product: HomePageProduct;
  priority?: boolean;
  showBadge?: boolean;
}

// ============================================================
// Helper function
// ============================================================

function formatPrice(price: number): string {
  return (
    new Intl.NumberFormat("fr-CI", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(price) + " FCFA"
  );
}

// ============================================================
// Client Component - ProductCard
// ============================================================

export function ProductCard({
  product,
  priority = false,
  showBadge = true,
}: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  // Get first image
  const mainImage = product.images[0] || "/images/placeholder.jpg";

  // Get available lots
  const lotsWithPrice = product.lots.filter((lot) => lot.isAvailable && lot.price > 0);
  const minLotPrice = lotsWithPrice.length > 0
    ? Math.min(...lotsWithPrice.map((lot) => lot.price))
    : null;

  // Check if product is out of stock (based on lots availability)
  const isOutOfStock = product.lots.length > 0 && lotsWithPrice.length === 0;

  // Check if product has multiple lots (requires selection)
  const hasMultipleLots = lotsWithPrice.length > 1;
  const singleLot = lotsWithPrice.length === 1 ? lotsWithPrice[0] : null;

  // Determine badge - priority: Épuisé > Nouveau > Best-seller
  const getBadge = () => {
    if (isOutOfStock) return { text: "Épuisé", style: "outofstock" as const };
    if (product.isNew) return { text: "Nouveau", style: "new" as const };
    if (product.isBestseller) return { text: "Best-seller", style: "bestseller" as const };
    return null;
  };
  const badge = getBadge();

  // Display price (use lot price if available, otherwise product price)
  const displayPrice = minLotPrice || product.price;
  const hasMultiplePrices = lotsWithPrice.length > 1;

  // Use slug for URL, fallback to id
  const productUrl = `/produit/${product.slug || product.id}`;

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    // If multiple lots, redirect to product page to select
    if (hasMultipleLots) {
      router.push(productUrl);
      return;
    }

    // Add to cart (single lot or no lots)
    if (singleLot) {
      addItem({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug || product.id,
        productImage: mainImage,
        categoryName: product.category?.name || "",
        price: product.price,
        stock: 999,
        lotId: singleLot.id,
        lotName: singleLot.name,
        lotPrice: singleLot.price,
        lotStock: singleLot.stock,
      });
    } else {
      addItem({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug || product.id,
        productImage: mainImage,
        categoryName: product.category?.name || "",
        price: product.price,
        stock: 999,
      });
    }
  };

  return (
    <article className="group" style={{ position: "relative", width: "100%", minWidth: 0 }}>
      {/* Image Container */}
      <div
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
            src={mainImage}
            alt={product.name}
            fill
            priority={priority}
            className="transition-transform duration-700 group-hover:scale-[1.06] cursor-pointer"
            style={{ objectFit: "cover", objectPosition: "center 20%" }}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Badge */}
        {showBadge && badge && (
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
          className="opacity-0 group-hover:opacity-100 hide-on-mobile"
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
            transition: "all 0.25s",
            cursor: isOutOfStock ? "not-allowed" : "pointer",
          }}
        >
          {isOutOfStock ? (
            "Indisponible"
          ) : hasMultipleLots ? (
            "Choisir une option"
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
        {/* Category */}
        {product.category && (
          <div
            style={{
              fontSize: "10.5px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#94786b",
              marginBottom: "7px",
            }}
          >
            {product.category.name}
          </div>
        )}

        {/* Name */}
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

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <span style={{ fontSize: "14.5px", fontWeight: 600, color: "#511F29" }}>
            {hasMultiplePrices ? "À partir de " : ""}
            {formatPrice(displayPrice)}
          </span>
          {product.oldPrice && !hasMultiplePrices && (
            <span
              style={{
                fontSize: "13px",
                color: "#b09a8d",
                textDecoration: "line-through",
              }}
            >
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
