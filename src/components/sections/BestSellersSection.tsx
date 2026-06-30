"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getBestsellers, formatPrice, type Product } from "@/data/products";
import { useCartStore } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";

export function BestSellersSection() {
  const products = getBestsellers();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useUIStore();

  const handleAddToCart = (product: Product) => {
    addItem(product.id);
  };

  return (
    <section
      id="ventes"
      className="section-padding"
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "52px" }}>
        <div
          style={{
            fontSize: "11.5px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#94786b",
            marginBottom: "14px",
          }}
        >
          Les favoris de la SO&apos;FAMILY
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            fontSize: "clamp(34px, 4vw, 56px)",
            lineHeight: 1,
            margin: 0,
            color: "#2a181d",
          }}
        >
          Meilleures ventes
        </h2>
      </div>

      {/* Grid */}
      <div className="grid-cols-4-responsive">
        {products.slice(0, 4).map((product) => {
          const isWishlisted = isInWishlist(product.id);

          return (
            <div key={product.id} className="group">
              {/* Image Container */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "4/5",
                  overflow: "hidden",
                  background: "#ece0d3",
                  borderRadius: "2px",
                }}
              >
                <Link href={`/produit/${product.id}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="transition-transform duration-700 group-hover:scale-[1.06] cursor-pointer"
                    style={{ objectFit: "cover", objectPosition: "center 20%" }}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </Link>

                {/* Badge */}
                {product.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      background: "#511F29",
                      color: "#fcd3b4",
                      fontSize: "9.5px",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      padding: "6px 11px",
                      borderRadius: "2px",
                    }}
                  >
                    {product.badge}
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Ajouter à la wishlist"
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "38px",
                    height: "38px",
                    borderRadius: "999px",
                    background: "rgba(250,246,241,0.9)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.25s",
                  }}
                >
                  <Heart
                    size={18}
                    fill={isWishlisted ? "#511F29" : "none"}
                    stroke={isWishlisted ? "#511F29" : "#94786b"}
                    strokeWidth={1.5}
                  />
                </button>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  style={{
                    position: "absolute",
                    left: "14px",
                    right: "14px",
                    bottom: "14px",
                    background: "rgba(42,24,29,0.86)",
                    color: "#fbf3ec",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "13px",
                    borderRadius: "2px",
                    backdropFilter: "blur(4px)",
                    transition: "all 0.25s",
                  }}
                >
                  Ajouter au panier
                </button>
              </div>

              {/* Product Info */}
              <div style={{ padding: "18px 2px 0" }}>
                <div
                  style={{
                    fontSize: "10.5px",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#94786b",
                    marginBottom: "7px",
                  }}
                >
                  {product.category}
                </div>
                <Link href={`/produit/${product.id}`} style={{ textDecoration: "none" }}>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 500,
                      fontSize: "19px",
                      margin: "0 0 9px",
                      color: "#2a181d",
                      cursor: "pointer",
                    }}
                  >
                    {product.name}
                  </h3>
                </Link>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span style={{ fontSize: "14.5px", fontWeight: 600, color: "#511F29" }}>
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span style={{ fontSize: "13px", color: "#b09a8d", textDecoration: "line-through" }}>
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
