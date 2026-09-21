"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Category, ProductWithCategory } from "@/lib/db/schema";

interface CategoryContentProps {
  category: Category;
  products: ProductWithCategory[];
}

export function CategoryContent({ category, products }: CategoryContentProps) {
  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "clamp(30px, 4vw, 50px) clamp(20px, 4vw, 40px) clamp(60px, 8vw, 100px)",
      }}
    >
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Catalogue", href: "/catalogue" },
          { label: category.name },
        ]}
      />

      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div
          style={{
            fontSize: "11.5px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#6b6b6b",
            marginBottom: "14px",
          }}
        >
          Collection
        </div>
        <h1
          style={{
            fontFamily: "var(--font-stack)",
            fontWeight: 500,
            fontSize: "clamp(34px, 4vw, 56px)",
            lineHeight: 1,
            color: "#000000",
            margin: "0 0 16px",
          }}
        >
          {category.name}
        </h1>
        {category.description && (
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.6,
              color: "#4a4a4a",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            {category.description}
          </p>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid-cols-4-responsive">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ color: "#6b6b6b", fontSize: "16px", marginBottom: "24px" }}>
            Aucun produit dans cette catégorie pour le moment.
          </p>
          <Link
            href="/catalogue"
            style={{
              color: "#000000",
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
