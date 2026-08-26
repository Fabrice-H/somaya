import Link from "next/link";
import { ProductCard } from "@/components/product";
import type { HomePageProduct } from "@/lib/queries/home";

interface FeaturedProductsSectionProps {
  products: HomePageProduct[];
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section
      id="vedettes"
      className="section-padding"
      style={{
        background: "#faf6f1",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Header - Centered */}
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
            Nos coups de cœur
          </div>
          <h2
            style={{
              fontFamily: "var(--font-playfair-display), 'Playfair Display', serif",
              fontWeight: 500,
              fontSize: "clamp(34px, 4vw, 56px)",
              lineHeight: 1,
              margin: 0,
              color: "#2a181d",
            }}
          >
            Sélection du moment
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#94786b",
              marginTop: "16px",
              maxWidth: "500px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Des pièces soigneusement sélectionnées pour vous
          </p>
        </div>

        {/* Grid - 4 columns responsive */}
        <div className="grid-cols-4-responsive">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>

        {/* Voir tout button - centered */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Link
            href="/catalogue"
            style={{
              display: "inline-block",
              fontSize: "12.5px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#511F29",
              textDecoration: "none",
              borderBottom: "1px solid rgba(81,31,41,0.35)",
              paddingBottom: "5px",
              transition: "opacity 0.25s",
            }}
          >
            Découvrir tout le catalogue
          </Link>
        </div>
      </div>
    </section>
  );
}
