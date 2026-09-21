"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, ShoppingBag, X } from "lucide-react";
import { ProductCard } from "@/features/products/components/ProductCard";
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
} from "@/shared/components/listing/ShopFilters";
import { useCartStore } from "@/features/cart/store";
import type { HomePageProduct } from "@/features/home/server/queries";
import type { PriceLotPublic, PriceLotItemPublic } from "@/features/lots/server/queries";

// ============================================================
// Types & helpers
// ============================================================

interface LotsContentProps {
  lots: PriceLotPublic[];
  availablePrices: number[];
  categories: Array<{ id: string; name: string; slug: string }>;
}

type FlatItem = { item: PriceLotItemPublic; lot: PriceLotPublic };
type SortOption = "price-asc" | "price-desc" | "name";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "name", label: "Alphabétique" },
];

type Filters = { price: number | null; category: string | null; inStockOnly: boolean };
const NO_FILTERS: Filters = { price: null, category: null, inStockOnly: false };

function matchesFilters({ item, lot }: FlatItem, f: Filters): boolean {
  if (f.price !== null && lot.price !== f.price) return false;
  if (f.category && lot.category?.id !== f.category) return false;
  if (f.inStockOnly && item.stock <= 0) return false;
  return true;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-CI").format(price) + " FCFA";
}

const itemName = ({ item, lot }: FlatItem) => item.label || lot.name;

// Lot item -> shared product card format
function toCardProduct(flat: FlatItem): HomePageProduct {
  const { item, lot } = flat;
  return {
    id: item.id,
    name: itemName(flat),
    slug: `lot-${lot.id}`,
    price: lot.price,
    oldPrice: null,
    images: [item.image],
    isNew: false,
    isBestseller: false,
    isFeatured: false,
    stock: item.stock,
    category: lot.category,
    lots: [],
  };
}

function useAddLotItem() {
  const addItem = useCartStore((state) => state.addItem);
  return ({ item, lot }: FlatItem) =>
    addItem({
      productId: `lot-${lot.id}`,
      productName: item.label || lot.name,
      productSlug: `lot-${lot.id}`,
      productImage: item.image,
      categoryName: lot.category?.name || "",
      price: lot.price,
      stock: item.stock,
      lotId: lot.id,
      lotName: lot.name,
      lotPrice: lot.price,
      lotStock: item.stock,
      itemId: item.id,
      itemLabel: item.label,
    });
}

// ============================================================
// LotsContent
// ============================================================

export function LotsContent({ lots, availablePrices, categories }: LotsContentProps) {
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openedItem, setOpenedItem] = useState<FlatItem | null>(null);
  const addLotItem = useAddLotItem();

  const allItems = useMemo(() => lots.flatMap((lot) => lot.items.map((item) => ({ item, lot }))), [lots]);

  const prices = useMemo(
    () =>
      (availablePrices.length > 0 ? availablePrices : [...new Set(lots.map((l) => l.price))]).toSorted(
        (a, b) => a - b
      ),
    [availablePrices, lots]
  );

  const countBy = (key: (flat: FlatItem) => string | number | undefined) => {
    const counts = new Map<string | number, number>();
    for (const flat of allItems) {
      const k = key(flat);
      if (k !== undefined) counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return counts;
  };
  const priceCounts = countBy((f) => f.lot.price);
  const categoryCounts = countBy((f) => f.lot.category?.id);
  const usedCategories = categories.filter((c) => categoryCounts.has(c.id));

  const filters = useMemo<Filters>(
    () => ({ price: selectedPrice, category: selectedCategory, inStockOnly }),
    [selectedPrice, selectedCategory, inStockOnly]
  );

  const filteredItems = useMemo(() => {
    const result = allItems.filter((flat) => matchesFilters(flat, filters));
    result.sort((a, b) => {
      const stockOrder = Number(a.item.stock <= 0) - Number(b.item.stock <= 0);
      if (stockOrder !== 0) return stockOrder;
      if (sortBy === "price-desc") return b.lot.price - a.lot.price;
      if (sortBy === "name") return itemName(a).localeCompare(itemName(b), "fr");
      return a.lot.price - b.lot.price;
    });
    return result;
  }, [allItems, filters, sortBy]);

  // "All budgets" + price sort: one section per price
  const groups = useMemo(() => {
    if (selectedPrice !== null || sortBy === "name") return null;
    const byPrice = new Map<number, FlatItem[]>();
    for (const flat of filteredItems) {
      byPrice.set(flat.lot.price, [...(byPrice.get(flat.lot.price) ?? []), flat]);
    }
    return [...byPrice.entries()].sort(([a], [b]) => (sortBy === "price-desc" ? b - a : a - b));
  }, [filteredItems, selectedPrice, sortBy]);

  const clearFilters = () => {
    setSelectedPrice(null);
    setSelectedCategory(null);
    setInStockOnly(false);
  };

  const filterCount = [selectedPrice !== null, selectedCategory, inStockOnly].filter(Boolean).length;
  const categoryLabel = usedCategories.find((c) => c.id === selectedCategory)?.name;

  const chips = [
    selectedPrice !== null && { key: "price", label: formatPrice(selectedPrice), onRemove: () => setSelectedPrice(null) },
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
              matchesFilters(f, { ...filters, [chip.key]: NO_FILTERS[chip.key as keyof Filters] })
            ).length,
          }))
          .filter((s) => s.count > 0);

  const renderGrid = (items: FlatItem[]) => (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:gap-y-14">
      {items.map((flat, index) => (
        <ProductCard
          key={flat.item.id}
          product={toCardProduct(flat)}
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
          sortOptions={SORT_OPTIONS}
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
        <QuickView flat={openedItem} onClose={() => setOpenedItem(null)} onAdd={() => addLotItem(openedItem)} />
      )}
    </div>
  );
}

// ============================================================
// Escape to close + scroll lock (quick view)
// ============================================================

function useDialogBehaviour(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);
}

// ============================================================
// Quick view (lot items have no product page)
// ============================================================

function QuickView({ flat, onClose, onAdd }: { flat: FlatItem; onClose: () => void; onAdd: () => void }) {
  const { item, lot } = flat;
  const [added, setAdded] = useState(false);
  const isOutOfStock = item.stock <= 0;
  useDialogBehaviour(true, onClose);

  const handleAdd = () => {
    if (isOutOfStock || added) return;
    onAdd();
    setAdded(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center md:items-center md:p-6">
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-black/40 animate-fade-in" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quickview-title"
        className="relative flex max-h-[92vh] w-full max-w-[880px] flex-col overflow-y-auto bg-white animate-fade-in md:flex-row"
      >
        <div className="relative aspect-[3/4] w-full shrink-0 bg-[var(--som-primary-50)] md:w-1/2">
          <Image
            src={item.image}
            alt={itemName(flat)}
            fill
            className={`object-cover ${isOutOfStock ? "opacity-55" : ""}`}
            sizes="(max-width: 768px) 100vw, 440px"
          />
        </div>

        <div className="flex flex-1 flex-col p-6 md:p-10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-2 top-2 flex h-11 w-11 cursor-pointer items-center justify-center bg-white/80 text-[var(--som-ink)] md:bg-transparent"
          >
            <X size={20} strokeWidth={1.4} />
          </button>

          {lot.category && (
            <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-[var(--som-gray)]">{lot.category.name}</p>
          )}
          <h2 id="quickview-title" className="m-0 mt-2 text-[22px] font-medium text-[var(--som-ink)] md:text-[26px]">
            {itemName(flat)}
          </h2>
          {item.label && <p className="m-0 mt-1 text-[14px] font-light text-[var(--som-gray)]">{lot.name}</p>}

          <p className="m-0 mt-5 text-[20px] text-[var(--som-ink)] tabular-nums">{formatPrice(lot.price)}</p>

          <p className="m-0 mt-4 flex items-center gap-2 text-[13px] text-[var(--som-gray)]">
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${
                isOutOfStock ? "bg-[#9a9a9a]" : item.stock > 3 ? "bg-[var(--som-success)]" : "bg-[var(--som-accent)]"
              }`}
            />
            {isOutOfStock ? "Épuisé" : item.stock > 3 ? "En stock" : `Plus que ${item.stock} en stock`}
          </p>

          <div className="mt-8 md:mt-auto md:pt-10">
            <button
              type="button"
              onClick={handleAdd}
              disabled={isOutOfStock}
              className="btn-primary w-full"
            >
              {added ? (
                <>
                  <Check size={16} strokeWidth={1.8} aria-hidden /> Ajouté au panier
                </>
              ) : isOutOfStock ? (
                "Article épuisé"
              ) : (
                <>
                  <ShoppingBag size={16} strokeWidth={1.5} aria-hidden /> Ajouter au panier
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
