"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ui/ProductCard";
import { ArrowUpDown, Tag, X, Search } from "lucide-react";
import type { Category, ProductWithCategory } from "@/lib/db/schema";

// ============================================================
// Types & Constants
// ============================================================

interface CatalogueContentProps {
  categories: Category[];
  products: ProductWithCategory[];
  initialSearchQuery?: string;
}

type SortOption = "newest" | "price-asc" | "price-desc";

// ============================================================
// Component
// ============================================================

export function CatalogueContent({ categories, products, initialSearchQuery = "" }: CatalogueContentProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync search query with URL
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
  }, [searchParams]);

  // Update URL when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    router.replace(`/catalogue${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const name = p.name.toLowerCase();
        const description = (p.description || "").toLowerCase();
        const category = (p.category?.name || "").toLowerCase();
        return name.includes(query) || description.includes(query) || category.includes(query);
      });
    }

    // Category filter
    if (activeCategory) {
      result = result.filter((p) => p.category?.slug === activeCategory);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => {
          const priceA = typeof a.price === "string" ? parseFloat(a.price) : a.price;
          const priceB = typeof b.price === "string" ? parseFloat(b.price) : b.price;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        result.sort((a, b) => {
          const priceA = typeof a.price === "string" ? parseFloat(a.price) : a.price;
          const priceB = typeof b.price === "string" ? parseFloat(b.price) : b.price;
          return priceB - priceA;
        });
        break;
      default:
        break;
    }

    // Always put out-of-stock products at the end
    result.sort((a, b) => {
      const aOutOfStock = a.stock <= 0;
      const bOutOfStock = b.stock <= 0;
      if (aOutOfStock && !bOutOfStock) return 1;
      if (!aOutOfStock && bOutOfStock) return -1;
      return 0;
    });

    return result;
  }, [products, activeCategory, sortBy, searchQuery]);

  // Active filters count
  const activeFilters = (activeCategory !== null ? 1 : 0) + (searchQuery.trim() ? 1 : 0);

  // Clear all filters
  const clearFilters = () => {
    setActiveCategory(null);
    setSearchQuery("");
    router.replace("/catalogue", { scroll: false });
  };

  return (
    <div style={{ background: "#faf6f1", minHeight: "100vh" }}>
      {/* Compact Header */}
      <div
        style={{
          background: "#511F29",
          padding: "clamp(32px, 5vw, 48px) clamp(20px, 4vw, 48px)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-serif), serif",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 40px)",
                color: "#fbf3ec",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Boutique
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(252, 211, 180, 0.7)",
                margin: "6px 0 0",
              }}
            >
              {products.length} articles disponibles
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            {/* Search Input */}
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(252, 211, 180, 0.6)",
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Rechercher..."
                style={{
                  padding: "10px 14px 10px 38px",
                  background: "rgba(252, 211, 180, 0.1)",
                  border: "1px solid rgba(252, 211, 180, 0.3)",
                  borderRadius: "100px",
                  color: "#fcd3b4",
                  fontSize: "13px",
                  fontWeight: 500,
                  width: "180px",
                  outline: "none",
                  transition: "all 0.2s",
                }}
                className="catalogue-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(252, 211, 180, 0.2)",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#fcd3b4",
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <Link
              href="/lots"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "rgba(252, 211, 180, 0.15)",
                border: "1px solid rgba(252, 211, 180, 0.3)",
                borderRadius: "100px",
                color: "#fcd3b4",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              <Tag size={16} />
              Voir par lots de prix
            </Link>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8ddd4",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(16px, 3vw, 48px)",
          }}
        >
          {/* Categories + Sort Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              padding: "16px 0",
            }}
          >
            {/* Categories */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                overflowX: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                flex: 1,
              }}
              className="hide-scrollbar"
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#94786b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  flexShrink: 0,
                  marginRight: "8px",
                }}
              >
                Catégorie
              </span>

              <button
                onClick={() => setActiveCategory(null)}
                style={{
                  flexShrink: 0,
                  padding: "8px 16px",
                  background: activeCategory === null ? "#511F29" : "transparent",
                  color: activeCategory === null ? "#fcd3b4" : "#2a181d",
                  border: activeCategory === null ? "none" : "1px solid #e8ddd4",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Tous
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.slug)}
                  style={{
                    flexShrink: 0,
                    padding: "8px 16px",
                    background: activeCategory === category.slug ? "#511F29" : "transparent",
                    color: activeCategory === category.slug ? "#fcd3b4" : "#2a181d",
                    border: activeCategory === category.slug ? "none" : "1px solid #e8ddd4",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <ArrowUpDown size={14} style={{ color: "#94786b" }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                style={{
                  appearance: "none",
                  padding: "8px 12px",
                  paddingRight: "28px",
                  background: "#faf6f1",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#2a181d",
                  cursor: "pointer",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394786b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                }}
              >
                <option value="newest">Plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "24px clamp(16px, 3vw, 48px) 80px",
        }}
      >
        {/* Results Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#2a181d",
              margin: 0,
            }}
          >
            <span style={{ fontWeight: 700, color: "#511F29" }}>
              {filteredProducts.length}
            </span>{" "}
            résultat{filteredProducts.length !== 1 ? "s" : ""}
          </p>

          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: "transparent",
                border: "1px solid #d4c4b0",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 500,
                color: "#94786b",
                cursor: "pointer",
              }}
            >
              <X size={14} />
              Effacer les filtres
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "clamp(12px, 2vw, 24px)",
            }}
            className="products-grid"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "#fff",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                margin: "0 auto 20px",
                background: "#faf6f1",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Tag size={28} style={{ color: "#94786b" }} />
            </div>
            <p
              style={{
                fontFamily: "var(--font-serif), serif",
                fontSize: "20px",
                color: "#2a181d",
                margin: "0 0 8px",
              }}
            >
              {searchQuery.trim()
                ? `Aucun résultat pour "${searchQuery}"`
                : "Aucun article trouvé"}
            </p>
            <p style={{ color: "#94786b", fontSize: "14px", margin: "0 0 24px" }}>
              {searchQuery.trim()
                ? "Essayez avec d'autres termes de recherche"
                : "Modifiez vos filtres pour voir plus de produits"}
            </p>
            <button
              onClick={clearFilters}
              style={{
                padding: "12px 28px",
                background: "#511F29",
                color: "#fcd3b4",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Voir tous les articles
            </button>
          </div>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .products-grid {
          grid-template-columns: repeat(4, 1fr);
        }

        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
      <style jsx global>{`
        .catalogue-search-input::placeholder {
          color: rgba(252, 211, 180, 0.5);
        }
        .catalogue-search-input:focus {
          border-color: rgba(252, 211, 180, 0.6);
          background: rgba(252, 211, 180, 0.15);
        }
      `}</style>
    </div>
  );
}
