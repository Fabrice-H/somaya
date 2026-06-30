"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { type Product, formatPrice } from "@/data/products";
import { useCartStore } from "@/stores/cart-store";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id);
  };

  return (
    <article style={{ position: "relative" }}>
      {/* Image Container */}
      <div
        className="group"
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
            src={product.images[0]}
            alt={product.name}
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center 20%",
              cursor: "pointer",
              transition: "transform 0.8s cubic-bezier(0.16,0.84,0.44,1)",
            }}
            className="group-hover:scale-[1.06]"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </Link>

        {/* Badge */}
        {(product.isNew || product.isBestseller) && (
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
            {product.isNew ? "Nouveau" : "Best-seller"}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          aria-label="Ajouter à la wishlist"
          className="group/heart"
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
            fill="none"
            stroke="#511F29"
            strokeWidth={1.5}
          />
        </button>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="opacity-0 group-hover:opacity-100 hide-on-mobile"
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
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
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
