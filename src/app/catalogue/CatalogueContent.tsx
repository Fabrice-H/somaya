"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { products, collections } from "@/data/products";

export function CatalogueContent() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase())
    : products;

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "clamp(30px, 4vw, 50px) 40px clamp(60px, 8vw, 100px)",
      }}
    >
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Catalogue" }]} />

      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div
          style={{
            fontSize: "11.5px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#94786b",
            marginBottom: "14px",
          }}
        >
          Notre Collection
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            fontSize: "clamp(34px, 4vw, 56px)",
            lineHeight: 1,
            margin: 0,
            color: "#2a181d",
          }}
        >
          Catalogue Complet
        </h1>
      </div>

      {/* Category Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "48px",
        }}
      >
        <button
          onClick={() => setActiveCategory(null)}
          style={{
            padding: "10px 24px",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s",
            background: activeCategory === null ? "#511F29" : "#fff",
            color: activeCategory === null ? "#fcd3b4" : "#2a181d",
            borderRadius: "2px",
          }}
        >
          Tous
        </button>
        {collections.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.slug)}
            style={{
              padding: "10px 24px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s",
              background: activeCategory === category.slug ? "#511F29" : "#fff",
              color: activeCategory === category.slug ? "#fcd3b4" : "#2a181d",
              borderRadius: "2px",
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {filteredProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ color: "#94786b", fontSize: "16px" }}>
            Aucun produit dans cette catégorie pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}
