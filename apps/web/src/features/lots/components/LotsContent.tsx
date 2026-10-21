"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/features/products/components/ProductCard";
import { EmptyResults } from "@/shared/components/listing/EmptyResults";
import { CheckOption, FilterGroup, OptionButton } from "@/shared/components/listing/FilterControls";
import { FilterDrawer } from "@/shared/components/listing/FilterDrawer";
import { FilterSidebar } from "@/shared/components/listing/FilterSidebar";
import { MobileFilterBar } from "@/shared/components/listing/MobileFilterBar";
import { ShopTopBar } from "@/shared/components/listing/ShopTopBar";
import type { EmptySuggestion, FilterChip } from "@/shared/components/listing/types";
import { formatPrice } from "@/shared/lib/format";
import { useAddLotItem } from "../hooks/useAddLotItem";
import { LOT_SORT_OPTIONS, NO_LOT_FILTERS } from "../constants";
import type { FlatLotItem, LotFilters, LotSortOption } from "../types";
import { compareLotItems, countBy, groupByPrice, matchesLotFilters, toLotCardProduct } from "../utils";
import type { PublicPriceLot } from "../types";
import { LotQuickView } from "./LotQuickView";

type LotsContentProps = {
  lots: PublicPriceLot[];
  availablePrices: number[];
  categories: { id: string; name: string; slug: string }[];
};

export function LotsContent({ lots, availablePrices, categories }: LotsContentProps) {
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<LotSortOption>("price-asc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openedItem, setOpenedItem] = useState<FlatLotItem | null>(null);
  const addLotItem = useAddLotItem();

  const allItems = useMemo(() => lots.flatMap((lot) => lot.items.map((item) => ({ item, lot }))), [lots]);

  const prices = useMemo(
    () =>
      (availablePrices.length > 0 ? availablePrices : [...new Set(lots.map((l) => l.price))]).toSorted((a, b) => a - b),
    [availablePrices, lots]
  );

  const priceCounts = countBy(allItems, (f) => f.lot.price);
  const categoryCounts = countBy(allItems, (f) => f.lot.category?.id);
  const usedCategories = categories.filter((c) => categoryCounts.has(c.id));

  const filters = useMemo<LotFilters>(
    () => ({ price: selectedPrice, category: selectedCategory, inStockOnly }),
    [selectedPrice, selectedCategory, inStockOnly]
  );

  const filteredItems = useMemo(() => {
    return allItems.filter((flat) => matchesLotFilters(flat, filters)).sort(compareLotItems(sortBy));
  }, [allItems, filters, sortBy]);
  const groups = useMemo(() => {
    if (selectedPrice !== null || sortBy === "name") return null;
    return groupByPrice(filteredItems, sortBy === "price-desc");
  }, [filteredItems, selectedPrice, sortBy]);

  const clearFilters = () => {
    setSelectedPrice(null);
    setSelectedCategory(null);
    setInStockOnly(false);
  };

  const filterCount = [selectedPrice !== null, selectedCategory, inStockOnly].filter(Boolean).length;
  const categoryLabel = usedCategories.find((c) => c.id === selectedCategory)?.name;

  const chips = [
    selectedPrice !== null && {
      key: "price",
      label: formatPrice(selectedPrice),
      onRemove: () => setSelectedPrice(null),
    },
    categoryLabel && { key: "category", label: categoryLabel, onRemove: () => setSelectedCategory(null) },
    inStockOnly && { key: "inStockOnly", label: "En stock", onRemove: () => setInStockOnly(false) },
  ].filter(Boolean) as FilterChip[];

  const suggestions: EmptySuggestion[] =
    filteredItems.length > 0
      ? []
      : chips
          .map((chip) => ({
            key: chip.key,
            label: chip.label,
            onClick: chip.onRemove,
            count: allItems.filter((f) =>
              matchesLotFilters(f, { ...filters, [chip.key]: NO_LOT_FILTERS[chip.key as keyof LotFilters] })
            ).length,
          }))
          .filter((s) => s.count > 0);

  const renderGrid = (items: FlatLotItem[]) => (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:gap-y-14">
      {items.map((flat, index) => (
        <ProductCard
          key={flat.item.id}
          product={toLotCardProduct(flat)}
          priority={index < 3}
          showWishlist={false}
          onOpen={() => setOpenedItem(flat)}
          onAddToCart={() => addLotItem(flat)}
        />
      ))}
    </div>
  );

  const controls = (
    <>
      <FilterGroup title="Budget">
        <OptionButton active={selectedPrice === null} onClick={() => setSelectedPrice(null)} count={allItems.length}>
          Tous les budgets
        </OptionButton>
        {prices.map((price) => (
          <OptionButton
            key={price}
            active={selectedPrice === price}
            onClick={() => setSelectedPrice(price)}
            count={priceCounts.get(price) ?? 0}
          >
            <span className="tabular-nums">{formatPrice(price)}</span>
          </OptionButton>
        ))}
      </FilterGroup>

      {usedCategories.length > 0 && (
        <FilterGroup title="Catégorie">
          <OptionButton active={selectedCategory === null} onClick={() => setSelectedCategory(null)}>
            Toutes
          </OptionButton>
          {usedCategories.map((category) => (
            <OptionButton
              key={category.id}
              active={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
              count={categoryCounts.get(category.id)}
            >
              {category.name}
            </OptionButton>
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Disponibilité">
        <CheckOption label="En stock" checked={inStockOnly} onChange={setInStockOnly} />
      </FilterGroup>
    </>
  );

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 lg:px-12">
        <ShopTopBar
          crumb="Par budget"
          title="Par budget"
          count={filteredItems.length}
          sortValue={sortBy}
          sortOptions={LOT_SORT_OPTIONS}
          onSortChange={setSortBy}
        />

        <div className="grid gap-10 pb-20 pt-6 md:pb-28 lg:grid-cols-[220px_1fr] lg:gap-14 lg:pt-10">
          <FilterSidebar canClear={filterCount > 0} onClear={clearFilters}>
            {controls}
          </FilterSidebar>

          <div className="min-w-0">
            <MobileFilterBar count={filterCount} chips={chips} onOpen={() => setIsFilterOpen(true)} />

            {filteredItems.length === 0 ? (
              <EmptyResults
                activeLabels={chips.map((c) => c.label)}
                suggestions={suggestions}
                clearLabel="Voir tous les budgets"
                onClearAll={clearFilters}
                recommendations={
                  allItems.some((f) => f.item.stock > 0)
                    ? renderGrid(allItems.filter((f) => f.item.stock > 0).slice(0, 3))
                    : undefined
                }
              />
            ) : groups ? (
              <div className="flex flex-col gap-14 md:gap-16">
                {groups.map(([price, items]) => (
                  <section key={price} aria-labelledby={`budget-${price}`}>
                    <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-[var(--som-border)] pb-3 md:mb-8">
                      <h2
                        id={`budget-${price}`}
                        className="m-0 text-[16px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] tabular-nums md:text-[18px]"
                      >
                        {formatPrice(price)}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setSelectedPrice(price)}
                        className="min-h-11 cursor-pointer text-[11px] uppercase tracking-[0.2em] text-[var(--som-primary)] underline-offset-4 hover:underline"
                      >
                        {items.length} pièce{items.length !== 1 ? "s" : ""}
                      </button>
                    </div>
                    {renderGrid(items)}
                  </section>
                ))}
              </div>
            ) : (
              renderGrid(filteredItems)
            )}
          </div>
        </div>
      </div>

      <FilterDrawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        resultCount={filteredItems.length}
        onClear={clearFilters}
      >
        {controls}
      </FilterDrawer>

      {openedItem && (
        <LotQuickView flat={openedItem} onClose={() => setOpenedItem(null)} onAdd={() => addLotItem(openedItem)} />
      )}
    </div>
  );
}
