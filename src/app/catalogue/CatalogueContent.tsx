"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product";
import {
  CheckOption,
  EmptyResults,
  FilterDrawer,
  FilterGroup,
  FilterSidebar,
  MobileFilterBar,
  OptionButton,
  ShopTopBar,
  type EmptySuggestion,
  type FilterChip,
} from "@/components/shop/ShopFilters";
import type { ShopProduct } from "@/lib/queries/products";

// ============================================================
// Types & helpers
// ============================================================

interface CatalogueContentProps {
  categories: Array<{ id: string; name: string; slug: string; imageUrl?: string | null }>;
  products: ShopProduct[];
  initialSearchQuery?: string;
}

type SortOption = "newest" | "price-asc" | "price-desc" | "name";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Nouveautés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "name", label: "Alphabétique" },
];

const PRICE_RANGES = [
  { key: "lt20", label: "Moins de 20 000 FCFA", min: 0, max: 19999 },
  { key: "20to50", label: "20 000 – 50 000 FCFA", min: 20000, max: 50000 },
  { key: "gt50", label: "Plus de 50 000 FCFA", min: 50001, max: Infinity },
] as const;
type PriceRangeKey = (typeof PRICE_RANGES)[number]["key"];

// Price shown on the card: cheapest available lot, otherwise product price
function effectivePrice(product: ShopProduct): number {
  const lotPrices = product.lots.filter((l) => l.isAvailable && l.price > 0).map((l) => l.price);
  return lotPrices.length > 0 ? Math.min(...lotPrices) : product.price;
}

function isOutOfStock(product: ShopProduct): boolean {
  if (product.lots.length > 0) return !product.lots.some((l) => l.isAvailable && l.price > 0);
  return product.stock !== undefined && product.stock <= 0;
}

function isOnSale(product: ShopProduct): boolean {
  return !!product.oldPrice && product.oldPrice > effectivePrice(product);
}

function inRange(product: ShopProduct, key: PriceRangeKey): boolean {
  const range = PRICE_RANGES.find((r) => r.key === key)!;
  const price = effectivePrice(product);
  return price >= range.min && price <= range.max;
}

type Filters = {
  query: string;
  category: string | null;
  priceRange: PriceRangeKey | null;
  inStockOnly: boolean;
  onSaleOnly: boolean;
};

const NO_FILTERS: Filters = { query: "", category: null, priceRange: null, inStockOnly: false, onSaleOnly: false };

function matchesFilters(p: ShopProduct, f: Filters): boolean {
  if (f.query) {
    const haystack = `${p.name} ${p.description ?? ""} ${p.category?.name ?? ""}`.toLowerCase();
    if (!haystack.includes(f.query)) return false;
  }
  if (f.category && p.category?.slug !== f.category) return false;
  if (f.priceRange && !inRange(p, f.priceRange)) return false;
  if (f.inStockOnly && isOutOfStock(p)) return false;
  if (f.onSaleOnly && !isOnSale(p)) return false;
  return true;
}

// ============================================================
// CatalogueContent
// ============================================================

export function CatalogueContent({ categories, products, initialSearchQuery = "" }: CatalogueContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? initialSearchQuery;

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRangeKey | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      if (p.category?.slug) counts[p.category.slug] = (counts[p.category.slug] || 0) + 1;
    }
    return counts;
  }, [products]);
  const visibleCategories = categories.filter((c) => categoryCounts[c.slug]);

  const filters = useMemo<Filters>(
    () => ({ query: searchQuery.toLowerCase().trim(), category: activeCategory, priceRange, inStockOnly, onSaleOnly }),
    [searchQuery, activeCategory, priceRange, inStockOnly, onSaleOnly]
  );

  const filteredProducts = useMemo(() => {
    const result = products.filter((p) => matchesFilters(p, filters));
    result.sort((a, b) => {
      // Sold-out pieces always last
      const stockOrder = Number(isOutOfStock(a)) - Number(isOutOfStock(b));
      if (stockOrder !== 0) return stockOrder;
      switch (sortBy) {
        case "price-asc":
          return effectivePrice(a) - effectivePrice(b);
        case "price-desc":
          return effectivePrice(b) - effectivePrice(a);
        case "name":
          return a.name.localeCompare(b.name, "fr");
        default:
          return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
      }
    });
    return result;
  }, [products, filters, sortBy]);

  const clearSearch = () => router.replace(pathname, { scroll: false });
  const clearFilters = () => {
    setActiveCategory(null);
    setPriceRange(null);
    setInStockOnly(false);
    setOnSaleOnly(false);
  };

  const filterCount = [activeCategory, priceRange, inStockOnly, onSaleOnly].filter(Boolean).length;
  const categoryLabel = visibleCategories.find((c) => c.slug === activeCategory)?.name;
  const priceLabel = PRICE_RANGES.find((r) => r.key === priceRange)?.label;

  const chips = [
    categoryLabel && { key: "category", label: categoryLabel, onRemove: () => setActiveCategory(null) },
    priceLabel && { key: "priceRange", label: priceLabel, onRemove: () => setPriceRange(null) },
    inStockOnly && { key: "inStockOnly", label: "En stock", onRemove: () => setInStockOnly(false) },
    onSaleOnly && { key: "onSaleOnly", label: "En promotion", onRemove: () => setOnSaleOnly(false) },
  ].filter(Boolean) as FilterChip[];

  // Empty state: for each active filter, how many pieces would show without it
  const searchChip: FilterChip[] = searchQuery ? [{ key: "query", label: `« ${searchQuery} »`, onRemove: clearSearch }] : [];
  const suggestions: EmptySuggestion[] =
    filteredProducts.length > 0
      ? []
      : [...searchChip, ...chips]
          .map((chip) => ({
            key: chip.key,
            label: chip.label,
            onClick: chip.onRemove,
            count: products.filter((p) =>
              matchesFilters(p, { ...filters, [chip.key]: NO_FILTERS[chip.key as keyof Filters] })
            ).length,
          }))
          .filter((s) => s.count > 0);

  const controls = (
    <>
      <FilterGroup title="Catégorie">
        <OptionButton active={activeCategory === null} onClick={() => setActiveCategory(null)} count={products.length}>
          Tout
        </OptionButton>
        {visibleCategories.map((category) => (
          <OptionButton
            key={category.id}
            active={activeCategory === category.slug}
            onClick={() => setActiveCategory(category.slug)}
            count={categoryCounts[category.slug]}
          >
            {category.name}
          </OptionButton>
        ))}
      </FilterGroup>

      <FilterGroup title="Prix">
        <OptionButton active={priceRange === null} onClick={() => setPriceRange(null)}>
          Tous les prix
        </OptionButton>
        {PRICE_RANGES.map((range) => (
          <OptionButton key={range.key} active={priceRange === range.key} onClick={() => setPriceRange(range.key)}>
            {range.label}
          </OptionButton>
        ))}
      </FilterGroup>

      <FilterGroup title="Disponibilité">
        <CheckOption label="En stock" checked={inStockOnly} onChange={setInStockOnly} />
        <CheckOption label="En promotion" checked={onSaleOnly} onChange={setOnSaleOnly} />
      </FilterGroup>
    </>
  );

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 lg:px-12">
        <ShopTopBar
          crumb="Boutique"
          title="La boutique"
          count={filteredProducts.length}
          sortValue={sortBy}
          sortOptions={SORT_OPTIONS}
          onSortChange={setSortBy}
        />

        <div className="grid gap-10 pb-20 pt-6 md:pb-28 lg:grid-cols-[220px_1fr] lg:gap-14 lg:pt-10">
          <FilterSidebar canClear={filterCount > 0} onClear={clearFilters}>
            {controls}
          </FilterSidebar>

          <div className="min-w-0">
            <MobileFilterBar count={filterCount} chips={chips} onOpen={() => setIsFilterOpen(true)} />

            {searchQuery && (
              <p className="m-0 mb-6 flex flex-wrap items-center gap-x-3 text-[14px] text-[var(--som-ink)]">
                Résultats pour « {searchQuery} »
                <button type="button" onClick={clearSearch} className="btn-link min-h-0 text-[11px]">
                  Effacer la recherche
                </button>
              </p>
            )}

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:gap-y-14">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 3} />
                ))}
              </div>
            ) : (
              <EmptyResults
                activeLabels={[...searchChip, ...chips].map((c) => c.label)}
                suggestions={suggestions}
                clearLabel="Voir toute la boutique"
                onClearAll={() => {
                  clearFilters();
                  if (searchQuery) clearSearch();
                }}
                recommendations={
                  <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6">
                    {products
                      .filter((p) => !isOutOfStock(p))
                      .slice(0, 3)
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                }
              />
            )}
          </div>
        </div>
      </div>

      <FilterDrawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        resultCount={filteredProducts.length}
        onClear={clearFilters}
      >
        {controls}
      </FilterDrawer>
    </div>
  );
}
