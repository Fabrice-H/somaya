"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { products, type Collection } from "@/data/products";

interface CategoryContentProps {
  collection: Collection;
}

export function CategoryContent({ collection }: CategoryContentProps) {
  // Map collection slug to product category
  const categoryMap: Record<string, string> = {
    femmes: "Femmes",
    hommes: "Hommes",
    bijoux: "Bijoux",
    sacs: "Sacs",
    montres: "Montres",
    boubous: "Boubous",
  };

  const categoryProducts = products.filter(
    (p) => p.category === categoryMap[collection.slug]
  );

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "clamp(30px, 4vw, 50px) 40px clamp(60px, 8vw, 100px)",
      }}
    >
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Catalogue", href: "/catalogue" },
          { label: collection.name },
        ]}
      />

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
          {collection.label}
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            fontSize: "clamp(34px, 4vw, 56px)",
            lineHeight: 1,
            color: "#2a181d",
            margin: "0 0 16px",
          }}
        >
          {collection.name}
        </h1>
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.6,
            color: "#6e5a50",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {collection.subtitle}
        </p>
      </div>

      {/* Products Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {categoryProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {/* Empty State */}
      {categoryProducts.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ color: "#94786b", fontSize: "16px", marginBottom: "24px" }}>
            Aucun produit dans cette catégorie pour le moment.
          </p>
          <Link
            href="/catalogue"
            style={{
              color: "#511F29",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "underline",
            }}
          >
            Voir tous les produits
          </Link>
        </div>
      )}
    </div>
  );
}
