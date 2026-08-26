"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag, ChevronDown, X, LayoutGrid } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import type { Category, ProductWithCategory } from "@/lib/db/schema";
import clsx from "clsx";

// ============================================================
// Types & Constants
// ============================================================

interface CatalogueContentProps {
  categories: Category[];
  products: ProductWithCategory[];
  initialSearchQuery?: string;
}

type SortOption = "newest" | "price-asc" | "price-desc" | "name";
type ViewMode = "comfort" | "dense";

// ============================================================
// Helpers
// ============================================================

function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-CI").format(price) + " F";
}

function getDiscountPercent(price: number, oldPrice: number): number {
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

// ============================================================
// Product Card Component
// ============================================================

interface ShopProductCardProps {
  product: ProductWithCategory;
  viewMode: ViewMode;
}

function ShopProductCard({ product, viewMode }: ShopProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const imageUrl = product.images?.[0] || "/images/placeholder.jpg";
  const price = typeof product.price === "string" ? parseFloat(product.price) : Number(product.price);
  const oldPrice = product.oldPrice
    ? (typeof product.oldPrice === "string" ? parseFloat(product.oldPrice) : Number(product.oldPrice))
    : null;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const hasDiscount = oldPrice && oldPrice > price;
  const discountPercent = hasDiscount ? getDiscountPercent(price, oldPrice) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: imageUrl,
      categoryName: product.category?.name || "",
      price: price,
      stock: product.stock,
    });
  };

  return (
    <article className="group relative">
      {/* Image Container */}
      <div className={clsx(
        "relative overflow-hidden bg-[#f5f0eb]",
        viewMode === "comfort" ? "aspect-[4/5] rounded-sm" : "aspect-square rounded-sm"
      )}>
        <Link href={`/produit/${product.slug}`} className="block h-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={clsx(
              "object-cover transition-transform duration-700",
              !isOutOfStock && "group-hover:scale-[1.06]",
              isOutOfStock && "grayscale opacity-70"
            )}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </Link>

        {/* Badges - Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && !isOutOfStock && (
            <span className="px-2.5 py-1 bg-[#2d5a3d] text-white text-[10px] font-semibold tracking-wider uppercase">
              Nouveau
            </span>
          )}
          {hasDiscount && !isOutOfStock && (
            <span className="px-2.5 py-1 bg-[#511F29] text-[#fcd3b4] text-[10px] font-semibold tracking-wider">
              -{discountPercent} %
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 bg-[#6b6b6b] text-white text-[10px] font-semibold tracking-wider uppercase">
              Épuisé
            </span>
          )}
        </div>

        {/* Low Stock Badge - Bottom Left */}
        {isLowStock && (
          <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#2d5a3d] text-white text-[10px] font-semibold tracking-wider uppercase">
            Plus que {product.stock}
          </span>
        )}

        {/* Add to Cart Button - Hover (Desktop only) */}
        {!isOutOfStock && (
          <button
            onClick={handleAddToCart}
            className="absolute left-3 right-3 bottom-3 py-3 bg-[#511F29]/95 text-white text-[11px] font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} />
            Ajouter au panier
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="pt-4">
        {/* Category & Color */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#94786b]">
            {product.category?.name || ""}
          </span>
        </div>

        {/* Name */}
        <Link href={`/produit/${product.slug}`}>
          <h3 className="font-[family-name:var(--font-serif)] text-[17px] text-[#2a181d] leading-snug mb-2 hover:text-[#511F29] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-[15px] font-semibold text-[#2a181d]">
            {formatPrice(price)}
          </span>
          {oldPrice && (
            <span className="text-[13px] text-[#b09a8d] line-through">
              {formatPrice(oldPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ============================================================
// Main Component
// ============================================================

export function CatalogueContent({ categories, products, initialSearchQuery = "" }: CatalogueContentProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [viewMode, setViewMode] = useState<ViewMode>("comfort");
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Calculate price range
  const priceRange = useMemo(() => {
    const prices = products.map((p) => Number(p.price));
    return {
      min: Math.min(...prices, 5000),
      max: Math.max(...prices, 100000),
    };
  }, [products]);

  // Set initial max price
  useEffect(() => {
    setMaxPrice(priceRange.max);
  }, [priceRange.max]);

  // Sync search query with URL
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
  }, [searchParams]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const product of products) {
      if (product.category?.slug) {
        counts[product.category.slug] = (counts[product.category.slug] || 0) + 1;
      }
    }
    return counts;
  }, [products]);

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

    // Price filter
    result = result.filter((p) => Number(p.price) <= maxPrice);

    // In stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // On sale filter
    if (onSaleOnly) {
      result = result.filter((p) => p.oldPrice && Number(p.oldPrice) > Number(p.price));
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    // Always put out-of-stock products at the end
    result.sort((a, b) => {
      if (a.stock <= 0 && b.stock > 0) return 1;
      if (a.stock > 0 && b.stock <= 0) return -1;
      return 0;
    });

    return result;
  }, [products, activeCategory, sortBy, searchQuery, maxPrice, inStockOnly, onSaleOnly]);

  // Clear all filters
  const clearFilters = () => {
    setActiveCategory(null);
    setSearchQuery("");
    setMaxPrice(priceRange.max);
    setInStockOnly(false);
    setOnSaleOnly(false);
    router.replace("/catalogue", { scroll: false });
  };

  const hasActiveFilters = activeCategory || searchQuery || maxPrice < priceRange.max || inStockOnly || onSaleOnly;

  const sortOptions = [
    { value: "newest", label: "Nouveautés" },
    { value: "price-asc", label: "Prix croissant" },
    { value: "price-desc", label: "Prix décroissant" },
    { value: "name", label: "Alphabétique" },
  ];

  return (
    <div className="min-h-screen bg-[#fbf9f7]">
      {/* Header */}
      <div className="bg-[#fbf9f7] border-b border-[#e8ddd4]">
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 lg:px-12 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#94786b] mb-4">
            <Link href="/" className="hover:text-[#511F29] transition-colors">Accueil</Link>
            <span className="mx-2">/</span>
            <Link href="/catalogue" className="hover:text-[#511F29] transition-colors">Boutique</Link>
            <span className="mx-2">/</span>
            <span className="text-[#2a181d]">Tous les articles</span>
          </div>

          {/* Title & Sort */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-[#2a181d] leading-none mb-3">
                La boutique
              </h1>
              <p className="text-[15px] text-[#94786b] max-w-md leading-relaxed">
                {products.length} pièces en ligne, contrôlées une par une avant la mise en vente.
                <br className="hidden md:block" />
                Sacs, bijoux, montres et tenues — le stock affiché est le stock réel.
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#94786b]">
                  Trier par
                </span>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e8ddd4] text-[13px] font-medium text-[#2a181d] min-w-[160px] justify-between"
                >
                  {sortOptions.find((o) => o.value === sortBy)?.label}
                  <ChevronDown size={16} className={clsx("transition-transform", isSortOpen && "rotate-180")} />
                </button>
              </div>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute top-full right-0 mt-1 bg-white border border-[#e8ddd4] shadow-lg z-50 min-w-[160px]">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value as SortOption);
                          setIsSortOpen(false);
                        }}
                        className={clsx(
                          "w-full px-4 py-2.5 text-left text-[13px] transition-colors",
                          sortBy === option.value
                            ? "bg-[#511F29] text-white"
                            : "text-[#2a181d] hover:bg-[#faf6f1]"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-5 md:px-8 lg:px-12 py-8">
        <div className="flex gap-8 lg:gap-12">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-[220px] flex-shrink-0">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#2a181d]">
                Filtrer
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#94786b] hover:text-[#511F29] transition-colors"
                >
                  Tout effacer
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#94786b] mb-4">
                Catégorie
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={clsx(
                      "flex items-center justify-between w-full text-left text-[14px] py-1 transition-colors",
                      !activeCategory
                        ? "text-[#2a181d] font-medium border-l-2 border-[#511F29] pl-3 -ml-[2px]"
                        : "text-[#94786b] hover:text-[#2a181d]"
                    )}
                  >
                    <span>Tout</span>
                    <span className="text-[12px] text-[#94786b]">{products.length}</span>
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveCategory(category.slug)}
                      className={clsx(
                        "flex items-center justify-between w-full text-left text-[14px] py-1 transition-colors",
                        activeCategory === category.slug
                          ? "text-[#2a181d] font-medium border-l-2 border-[#511F29] pl-3 -ml-[2px]"
                          : "text-[#94786b] hover:text-[#2a181d]"
                      )}
                    >
                      <span>{category.name}</span>
                      <span className="text-[12px] text-[#94786b]">{categoryCounts[category.slug] || 0}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#94786b]">
                  Prix maximum
                </h3>
                <span className="text-[13px] font-medium text-[#2a181d]">
                  {formatPrice(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-[#e8ddd4] rounded-full appearance-none cursor-pointer accent-[#511F29]"
              />
              <div className="flex justify-between text-[11px] text-[#94786b] mt-2">
                <span>{formatPrice(priceRange.min)}</span>
                <span>{formatPrice(priceRange.max)}</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-4 border-t border-[#e8ddd4]">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-[#2a181d]">En stock uniquement</span>
                <button
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={clsx(
                    "relative w-11 h-6 rounded-full transition-colors",
                    inStockOnly ? "bg-[#511F29]" : "bg-[#e8ddd4]"
                  )}
                >
                  <span
                    className={clsx(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                      inStockOnly ? "right-1" : "left-1"
                    )}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-[#2a181d]">En promotion</span>
                <button
                  onClick={() => setOnSaleOnly(!onSaleOnly)}
                  className={clsx(
                    "relative w-11 h-6 rounded-full transition-colors",
                    onSaleOnly ? "bg-[#511F29]" : "bg-[#e8ddd4]"
                  )}
                >
                  <span
                    className={clsx(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                      onSaleOnly ? "right-1" : "left-1"
                    )}
                  />
                </button>
              </label>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Products Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[12px] font-medium tracking-[0.1em] uppercase text-[#94786b]">
                {filteredProducts.length} article{filteredProducts.length !== 1 ? "s" : ""}
              </p>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-[#f5f0eb] p-1 rounded">
                <button
                  onClick={() => setViewMode("comfort")}
                  className={clsx(
                    "px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors rounded-sm",
                    viewMode === "comfort"
                      ? "bg-[#511F29] text-white"
                      : "text-[#94786b] hover:text-[#2a181d]"
                  )}
                >
                  Confort
                </button>
                <button
                  onClick={() => setViewMode("dense")}
                  className={clsx(
                    "px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors rounded-sm",
                    viewMode === "dense"
                      ? "bg-[#511F29] text-white"
                      : "text-[#94786b] hover:text-[#2a181d]"
                  )}
                >
                  Dense
                </button>
              </div>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden w-full mb-6 py-3 bg-white border border-[#e8ddd4] text-[13px] font-medium text-[#2a181d] flex items-center justify-center gap-2"
            >
              <LayoutGrid size={16} />
              Filtrer {hasActiveFilters && `(${[activeCategory, inStockOnly, onSaleOnly, maxPrice < priceRange.max].filter(Boolean).length})`}
            </button>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className={clsx(
                "grid gap-x-5 gap-y-8",
                viewMode === "comfort"
                  ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-2 md:grid-cols-4 xl:grid-cols-5"
              )}>
                {filteredProducts.map((product) => (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg">
                <div className="w-16 h-16 mx-auto mb-5 bg-[#faf6f1] rounded-full flex items-center justify-center">
                  <ShoppingBag size={28} className="text-[#94786b]" />
                </div>
                <p className="font-[family-name:var(--font-serif)] text-xl text-[#2a181d] mb-2">
                  Aucun article trouvé
                </p>
                <p className="text-[14px] text-[#94786b] mb-6">
                  Modifiez vos filtres pour voir plus de produits
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[#511F29] text-white text-[12px] font-semibold tracking-wider uppercase"
                >
                  Effacer les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#e8ddd4] p-5 flex items-center justify-between">
              <span className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#2a181d]">
                Filtres
              </span>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X size={24} className="text-[#94786b]" />
              </button>
            </div>
            <div className="p-5">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#94786b] mb-4">
                  Catégorie
                </h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveCategory(null)}
                      className={clsx(
                        "flex items-center justify-between w-full text-left text-[14px] py-1",
                        !activeCategory ? "text-[#2a181d] font-medium" : "text-[#94786b]"
                      )}
                    >
                      <span>Tout</span>
                      <span className="text-[12px]">{products.length}</span>
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => setActiveCategory(category.slug)}
                        className={clsx(
                          "flex items-center justify-between w-full text-left text-[14px] py-1",
                          activeCategory === category.slug ? "text-[#2a181d] font-medium" : "text-[#94786b]"
                        )}
                      >
                        <span>{category.name}</span>
                        <span className="text-[12px]">{categoryCounts[category.slug] || 0}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#94786b]">
                    Prix maximum
                  </h3>
                  <span className="text-[13px] font-medium text-[#2a181d]">
                    {formatPrice(maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  step={1000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1 bg-[#e8ddd4] rounded-full appearance-none cursor-pointer accent-[#511F29]"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[13px] text-[#2a181d]">En stock uniquement</span>
                  <button
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={clsx(
                      "relative w-11 h-6 rounded-full transition-colors",
                      inStockOnly ? "bg-[#511F29]" : "bg-[#e8ddd4]"
                    )}
                  >
                    <span
                      className={clsx(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                        inStockOnly ? "right-1" : "left-1"
                      )}
                    />
                  </button>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[13px] text-[#2a181d]">En promotion</span>
                  <button
                    onClick={() => setOnSaleOnly(!onSaleOnly)}
                    className={clsx(
                      "relative w-11 h-6 rounded-full transition-colors",
                      onSaleOnly ? "bg-[#511F29]" : "bg-[#e8ddd4]"
                    )}
                  >
                    <span
                      className={clsx(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                        onSaleOnly ? "right-1" : "left-1"
                      )}
                    />
                  </button>
                </label>
              </div>

              {/* Apply Button */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 bg-[#511F29] text-white text-[12px] font-semibold tracking-wider uppercase"
                >
                  Voir {filteredProducts.length} résultat{filteredProducts.length !== 1 ? "s" : ""}
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-3 border border-[#e8ddd4] text-[#94786b] text-[12px] font-semibold tracking-wider uppercase"
                  >
                    Tout effacer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
