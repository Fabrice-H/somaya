import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product";
import type { HomePageProduct } from "@/lib/queries/home";

// ============================================================
// Types
// ============================================================

interface BestSellersSectionProps {
  products: HomePageProduct[];
}

// ============================================================
// Server Component - BestSellersSection
// Style Telo - Clean, Modern
// ============================================================

export function BestSellersSection({ products }: BestSellersSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section
      id="ventes"
      style={{
        background: "#ffffff",
        padding: "clamp(40px, 5vw, 60px) 0",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 48px)",
        }}
      >
        {/* Header */}
        <div
          className="animate-fade-in"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "clamp(32px, 5vw, 56px)",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <span
              style={{
                display: "block",
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#94786b",
                marginBottom: "10px",
                fontWeight: 500,
              }}
            >
              Les favoris
            </span>
            <h2
              style={{
                fontFamily: "var(--font-serif), serif",
                fontWeight: 400,
                fontSize: "clamp(32px, 4vw, 48px)",
                lineHeight: 1.1,
                margin: 0,
                color: "#2a181d",
                letterSpacing: "-0.02em",
              }}
            >
              Meilleures ventes
            </h2>
          </div>
          <Link
            href="/catalogue"
            className="group"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#511F29",
              textDecoration: "none",
              padding: "12px 24px",
              border: "1px solid #d4c4b0",
              borderRadius: "6px",
              transition: "all 0.3s ease",
            }}
          >
            Tout voir
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="products-grid-4">
          {products.slice(0, 4).map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} priority={index < 2} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
