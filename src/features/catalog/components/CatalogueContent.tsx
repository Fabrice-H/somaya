"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/features/products/components/ProductCard";
import { EmptyResults } from "@/shared/components/listing/EmptyResults";
import { CheckOption, FilterGroup, OptionButton } from "@/shared/components/listing/FilterControls";
import { FilterDrawer } from "@/shared/components/listing/FilterDrawer";
import { FilterSidebar } from "@/shared/components/listing/FilterSidebar";
import { MobileFilterBar } from "@/shared/components/listing/MobileFilterBar";
import { ShopTopBar } from "@/shared/components/listing/ShopTopBar";
import type { EmptySuggestion, FilterChip } from "@/shared/components/listing/types";
import { isOutOfStock } from "@/features/products/utils";
import { NO_FILTERS, PRICE_RANGES, SORT_OPTIONS } from "../constants";
import type { CatalogueFilters, PriceRangeKey, SortOption } from "../types";
import { compareProducts, countByCategory, matchesFilters } from "../utils";
import type { ShopProduct } from "@/features/products/types";

interface CatalogueContentProps {
  categories: Array<{ id: string; name: string; slug: string; imageUrl?: string | null }>;
  products: ShopProduct[];
  initialSearchQuery?: string;
  initialCategory?: string | null;
  title?: string;
}

export function CatalogueContent({
  categories,
  products,
  initialSearchQuery = "",
  initialCategory = null,
  title = "La boutique",
}: CatalogueContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? initialSearchQuery;

  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);
  const [priceRange, setPriceRange] = useState<PriceRangeKey | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categoryCounts = useMemo(() => countByCategory(products), [products]);
  const visibleCategories = categories.filter((c) => categoryCounts[c.slug]);

  const filters = useMemo<CatalogueFilters>(
    () => ({ query: searchQuery.toLowerCase().trim(), category: activeCategory, priceRange, inStockOnly, onSaleOnly }),
    [searchQuery, activeCategory, priceRange, inStockOnly, onSaleOnly]
  );

  const filteredProducts = useMemo(() => {
    const result = products.filter((p) => matchesFilters(p, filters));
    return result.sort(compareProducts(sortBy));
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
  const searchChip: FilterChip[] = searchQuery
    ? [{ key: "query", label: `« ${searchQuery} »`, onRemove: clearSearch }]
    : [];
  const suggestions: EmptySuggestion[] =
    filteredProducts.length > 0
      ? []
      : [...searchChip, ...chips]
          .map((chip) => ({
            key: chip.key,
            label: chip.label,
            onClick: chip.onRemove,
            count: products.filter((p) =>
              matchesFilters(p, { ...filters, [chip.key]: NO_FILTERS[chip.key as keyof CatalogueFilters] })
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
          crumb={title === "La boutique" ? "Boutique" : title}
          title={title}
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
