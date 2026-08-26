"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingBag,
  ChevronDown,
  X,
  LayoutGrid,
  Check,
  Grid3X3,
  Layers,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import type { PriceLotPublic, PriceLotItemPublic } from "@/lib/queries/lots";
import clsx from "clsx";

// ============================================================
// Types & Constants
// ============================================================

interface LotsContentProps {
  lots: PriceLotPublic[];
  availablePrices: number[];
  categories: Array<{ id: string; name: string; slug: string }>;
}

type FlatItem = {
  item: PriceLotItemPublic;
  lot: PriceLotPublic;
};

type SortOption = "price-asc" | "price-desc" | "name" | "category";
type ViewMode = "comfort" | "dense";
type GroupMode = "price" | "category" | "none";

// ============================================================
// Helpers
// ============================================================

function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-CI").format(price) + " F";
}

function formatShortPrice(price: number): string {
  if (price >= 1000) {
    const k = price / 1000;
    return k === Math.floor(k) ? `${k}k` : `${Math.round(k)}k`;
  }
  return `${price}`;
}

// ============================================================
// Product Card Component
// ============================================================

interface LotItemCardProps {
  item: PriceLotItemPublic;
  lot: PriceLotPublic;
  viewMode: ViewMode;
  onClick: () => void;
}

function LotItemCard({ item, lot, viewMode, onClick }: LotItemCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = item.stock <= 0;
  const isLowStock = item.stock > 0 && item.stock <= 3;
  const categoryName = lot.category?.name || "";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem({
      productId: `lot-${lot.id}`,
      productName: item.label || lot.name,
      productSlug: `lot-${lot.id}`,
      productImage: item.image,
      categoryName: categoryName,
      price: lot.price,
      stock: item.stock,
      lotId: lot.id,
      lotName: lot.name,
      lotPrice: lot.price,
      lotStock: item.stock,
      itemId: item.id,
      itemLabel: item.label,
    });
  };

  return (
    <article className="group relative" onClick={onClick}>
      {/* Image Container */}
      <div
        className={clsx(
          "relative overflow-hidden bg-[#f5f0eb] cursor-pointer",
          viewMode === "comfort" ? "aspect-[4/5] rounded-sm" : "aspect-square rounded-sm"
        )}
      >
        <Image
          src={item.image}
          alt={item.label || lot.name}
          fill
          className={clsx(
            "object-cover transition-transform duration-700",
            !isOutOfStock && "group-hover:scale-[1.06]",
            isOutOfStock && "grayscale opacity-70"
          )}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Badges - Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Price Badge */}
          <span
            className={clsx(
              "px-2.5 py-1 text-[10px] font-semibold tracking-wider",
              isOutOfStock
                ? "bg-[#6b6b6b] text-white uppercase"
                : "bg-[#511F29] text-[#fcd3b4]"
            )}
          >
            {isOutOfStock ? "Épuisé" : formatShortPrice(lot.price)}
          </span>
        </div>

        {/* Low Stock Badge - Bottom Left */}
        {isLowStock && (
          <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#2d5a3d] text-white text-[10px] font-semibold tracking-wider uppercase">
            Plus que {item.stock}
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
        {/* Category */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#94786b]">
            {categoryName}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-[family-name:var(--font-serif)] text-[17px] text-[#2a181d] leading-snug mb-2 hover:text-[#511F29] transition-colors cursor-pointer">
          {item.label || lot.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-[15px] font-semibold text-[#2a181d]">
            {formatPrice(lot.price)}
          </span>
        </div>
      </div>
    </article>
  );
}

// ============================================================
// Quick View Modal
// ============================================================

interface QuickViewModalProps {
  item: PriceLotItemPublic;
  lot: PriceLotPublic;
  onClose: () => void;
}

function QuickViewModal({ item, lot, onClose }: QuickViewModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const isOutOfStock = item.stock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;

    addItem({
      productId: `lot-${lot.id}`,
      productName: lot.name,
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

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
      >
        {/* Image */}
        <div className="relative md:w-1/2 aspect-square md:aspect-auto">
          <Image
            src={item.image}
            alt={item.label || lot.name}
            fill
            className={`object-cover ${isOutOfStock ? "grayscale" : ""}`}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-[#511F29] px-6 py-3 text-lg font-bold uppercase">
                Épuisé
              </span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#511F29] hover:bg-white transition-colors shadow-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Details */}
        <div className="md:w-1/2 p-8 flex flex-col">
          {lot.category && (
            <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#94786b] mb-2">
              {lot.category.name}
            </span>
          )}

          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-[#2a181d] mb-2">
            {item.label || lot.name}
          </h2>

          <p className="text-sm text-[#94786b] mb-6">{lot.name}</p>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl font-bold text-[#511F29]">
              {formatPrice(lot.price)}
            </span>
          </div>

          {/* Stock info */}
          {!isOutOfStock && (
            <div className="flex items-center gap-2 mb-8">
              <div
                className={`w-2 h-2 rounded-full ${item.stock > 5 ? "bg-green-500" : "bg-orange-500"}`}
              />
              <span className="text-sm text-[#94786b]">
                {item.stock > 5 ? "En stock" : `Plus que ${item.stock} en stock`}
              </span>
            </div>
          )}

          {/* Add to cart */}
          <div className="mt-auto space-y-3">
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={clsx(
                "w-full py-4 text-base font-semibold flex items-center justify-center gap-3 transition-all",
                added
                  ? "bg-green-500 text-white"
                  : isOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#511F29] text-white hover:bg-[#3d171f]"
              )}
            >
              {added ? (
                <>
                  <Check size={20} /> Ajouté au panier
                </>
              ) : isOutOfStock ? (
                "Article épuisé"
              ) : (
                <>
                  <ShoppingBag size={20} /> Ajouter au panier
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// Main Component
// ============================================================

export function LotsContent({ lots, availablePrices, categories }: LotsContentProps) {
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [viewMode, setViewMode] = useState<ViewMode>("comfort");
  const [groupMode, setGroupMode] = useState<GroupMode>("price");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FlatItem | null>(null);

  // Flatten all items from all lots
  const allItems = useMemo(() => {
    const items: FlatItem[] = [];
    for (const lot of lots) {
      for (const item of lot.items) {
        items.push({ item, lot });
      }
    }
    return items;
  }, [lots]);

  // Price counts
  const priceCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const { lot } of allItems) {
      counts[lot.price] = (counts[lot.price] || 0) + 1;
    }
    return counts;
  }, [allItems]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const { lot } of allItems) {
      if (lot.category?.id) {
        counts[lot.category.id] = (counts[lot.category.id] || 0) + 1;
      }
    }
    return counts;
  }, [allItems]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...allItems];

    // Price filter
    if (selectedPrice !== null) {
      result = result.filter(({ lot }) => lot.price === selectedPrice);
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(({ lot }) => lot.category?.id === selectedCategory);
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter(({ item }) => item.stock > 0);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.lot.price - b.lot.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.lot.price - a.lot.price);
        break;
      case "name":
        result.sort((a, b) => (a.item.label || a.lot.name).localeCompare(b.item.label || b.lot.name));
        break;
      case "category":
        result.sort((a, b) => (a.lot.category?.name || "").localeCompare(b.lot.category?.name || ""));
        break;
    }

    // Always put out-of-stock at the end
    result.sort((a, b) => {
      if (a.item.stock <= 0 && b.item.stock > 0) return 1;
      if (a.item.stock > 0 && b.item.stock <= 0) return -1;
      return 0;
    });

    return result;
  }, [allItems, selectedPrice, selectedCategory, inStockOnly, sortBy]);

  // Group by price
  const itemsByPrice = useMemo(() => {
    if (groupMode !== "price") return [];
    const groups = new Map<number, FlatItem[]>();
    for (const flatItem of filteredItems) {
      const price = flatItem.lot.price;
      if (!groups.has(price)) {
        groups.set(price, []);
      }
      groups.get(price)!.push(flatItem);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a - b);
  }, [filteredItems, groupMode]);

  // Group by category
  const itemsByCategory = useMemo(() => {
    if (groupMode !== "category") return [];
    const groups = new Map<string, { name: string; items: FlatItem[] }>();
    const noCategory = { name: "Sans catégorie", items: [] as FlatItem[] };

    for (const flatItem of filteredItems) {
      const catId = flatItem.lot.category?.id;
      const catName = flatItem.lot.category?.name;

      if (catId && catName) {
        if (!groups.has(catId)) {
          groups.set(catId, { name: catName, items: [] });
        }
        groups.get(catId)!.items.push(flatItem);
      } else {
        noCategory.items.push(flatItem);
      }
    }

    const result = Array.from(groups.entries())
      .map(([id, data]) => ({ id, name: data.name, items: data.items }))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (noCategory.items.length > 0) {
      result.push({ id: "no-category", name: noCategory.name, items: noCategory.items });
    }

    return result;
  }, [filteredItems, groupMode]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedPrice(null);
    setSelectedCategory(null);
    setInStockOnly(false);
  };

  const hasActiveFilters = selectedPrice !== null || selectedCategory !== null || inStockOnly;

  const sortOptions = [
    { value: "price-asc", label: "Prix croissant" },
    { value: "price-desc", label: "Prix décroissant" },
    { value: "name", label: "Alphabétique" },
    { value: "category", label: "Par catégorie" },
  ];

  return (
    <div className="min-h-screen bg-[#fbf9f7]">
      {/* Header */}
      <div className="bg-[#fbf9f7] border-b border-[#e8ddd4]">
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 lg:px-12 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#94786b] mb-4">
            <Link href="/" className="hover:text-[#511F29] transition-colors">
              Accueil
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#2a181d]">Par Budget</span>
          </div>

          {/* Title & Sort */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-[#2a181d] leading-none mb-3">
                Par Budget
              </h1>
              <p className="text-[15px] text-[#94786b] max-w-md leading-relaxed">
                {allItems.length} articles disponibles, classés par gamme de prix.
                <br className="hidden md:block" />
                Trouvez l'article parfait selon votre budget.
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
                  <ChevronDown
                    size={16}
                    className={clsx("transition-transform", isSortOpen && "rotate-180")}
                  />
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

            {/* Prices */}
            <div className="mb-8">
              <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#94786b] mb-4">
                Budget
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedPrice(null)}
                    className={clsx(
                      "flex items-center justify-between w-full text-left text-[14px] py-1 transition-colors",
                      selectedPrice === null
                        ? "text-[#2a181d] font-medium border-l-2 border-[#511F29] pl-3 -ml-[2px]"
                        : "text-[#94786b] hover:text-[#2a181d]"
                    )}
                  >
                    <span>Tous les prix</span>
                    <span className="text-[12px] text-[#94786b]">{allItems.length}</span>
                  </button>
                </li>
                {availablePrices.map((price) => (
                  <li key={price}>
                    <button
                      onClick={() => setSelectedPrice(price)}
                      className={clsx(
                        "flex items-center justify-between w-full text-left text-[14px] py-1 transition-colors",
                        selectedPrice === price
                          ? "text-[#2a181d] font-medium border-l-2 border-[#511F29] pl-3 -ml-[2px]"
                          : "text-[#94786b] hover:text-[#2a181d]"
                      )}
                    >
                      <span>{formatShortPrice(price)} FCFA</span>
                      <span className="text-[12px] text-[#94786b]">{priceCounts[price] || 0}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="mb-8">
                <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#94786b] mb-4">
                  Catégorie
                </h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={clsx(
                        "flex items-center justify-between w-full text-left text-[14px] py-1 transition-colors",
                        !selectedCategory
                          ? "text-[#2a181d] font-medium border-l-2 border-[#511F29] pl-3 -ml-[2px]"
                          : "text-[#94786b] hover:text-[#2a181d]"
                      )}
                    >
                      <span>Toutes</span>
                      <span className="text-[12px] text-[#94786b]">{allItems.length}</span>
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        className={clsx(
                          "flex items-center justify-between w-full text-left text-[14px] py-1 transition-colors",
                          selectedCategory === category.id
                            ? "text-[#2a181d] font-medium border-l-2 border-[#511F29] pl-3 -ml-[2px]"
                            : "text-[#94786b] hover:text-[#2a181d]"
                        )}
                      >
                        <span>{category.name}</span>
                        <span className="text-[12px] text-[#94786b]">
                          {categoryCounts[category.id] || 0}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Products Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className="text-[12px] font-medium tracking-[0.1em] uppercase text-[#94786b]">
                {filteredItems.length} article{filteredItems.length !== 1 ? "s" : ""}
              </p>

              <div className="flex items-center gap-3">
                {/* Group Mode Toggle */}
                <div className="flex items-center gap-1 bg-[#f5f0eb] p-1 rounded">
                  <button
                    onClick={() => setGroupMode("price")}
                    className={clsx(
                      "px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors rounded-sm flex items-center gap-1.5",
                      groupMode === "price"
                        ? "bg-[#511F29] text-white"
                        : "text-[#94786b] hover:text-[#2a181d]"
                    )}
                  >
                    <Layers size={14} />
                    <span className="hidden sm:inline">Prix</span>
                  </button>
                  <button
                    onClick={() => setGroupMode("category")}
                    className={clsx(
                      "px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors rounded-sm flex items-center gap-1.5",
                      groupMode === "category"
                        ? "bg-[#511F29] text-white"
                        : "text-[#94786b] hover:text-[#2a181d]"
                    )}
                  >
                    <Grid3X3 size={14} />
                    <span className="hidden sm:inline">Catégorie</span>
                  </button>
                  <button
                    onClick={() => setGroupMode("none")}
                    className={clsx(
                      "px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors rounded-sm",
                      groupMode === "none"
                        ? "bg-[#511F29] text-white"
                        : "text-[#94786b] hover:text-[#2a181d]"
                    )}
                  >
                    <span className="hidden sm:inline">Tout</span>
                    <span className="sm:hidden">—</span>
                  </button>
                </div>

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
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden w-full mb-6 py-3 bg-white border border-[#e8ddd4] text-[13px] font-medium text-[#2a181d] flex items-center justify-center gap-2"
            >
              <LayoutGrid size={16} />
              Filtrer{" "}
              {hasActiveFilters &&
                `(${[selectedPrice !== null, selectedCategory !== null, inStockOnly].filter(Boolean).length})`}
            </button>

            {/* Products */}
            {filteredItems.length > 0 ? (
              groupMode === "none" ? (
                /* No grouping */
                <div
                  className={clsx(
                    "grid gap-x-5 gap-y-8",
                    viewMode === "comfort"
                      ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-2 md:grid-cols-4 xl:grid-cols-5"
                  )}
                >
                  {filteredItems.map(({ item, lot }) => (
                    <LotItemCard
                      key={`${lot.id}-${item.id}`}
                      item={item}
                      lot={lot}
                      viewMode={viewMode}
                      onClick={() => setSelectedItem({ item, lot })}
                    />
                  ))}
                </div>
              ) : groupMode === "price" ? (
                /* Group by price */
                <div className="space-y-12">
                  {itemsByPrice.map(([price, items]) => (
                    <section key={price}>
                      {/* Section Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <h2 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl text-[#2a181d] whitespace-nowrap">
                          {formatShortPrice(price)} FCFA
                        </h2>
                        <div className="flex-1 h-px bg-[#e8ddd4]" />
                        <span className="text-[12px] text-[#94786b] whitespace-nowrap">
                          {items.length} article{items.length > 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Items Grid */}
                      <div
                        className={clsx(
                          "grid gap-x-5 gap-y-8",
                          viewMode === "comfort"
                            ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                            : "grid-cols-2 md:grid-cols-4 xl:grid-cols-5"
                        )}
                      >
                        {items.map(({ item, lot }) => (
                          <LotItemCard
                            key={`${lot.id}-${item.id}`}
                            item={item}
                            lot={lot}
                            viewMode={viewMode}
                            onClick={() => setSelectedItem({ item, lot })}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                /* Group by category */
                <div className="space-y-12">
                  {itemsByCategory.map((category) => (
                    <section key={category.id}>
                      {/* Section Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <h2 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl text-[#2a181d] whitespace-nowrap">
                          {category.name}
                        </h2>
                        <div className="flex-1 h-px bg-[#e8ddd4]" />
                        <span className="text-[12px] text-[#94786b] whitespace-nowrap">
                          {category.items.length} article{category.items.length > 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Items Grid */}
                      <div
                        className={clsx(
                          "grid gap-x-5 gap-y-8",
                          viewMode === "comfort"
                            ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                            : "grid-cols-2 md:grid-cols-4 xl:grid-cols-5"
                        )}
                      >
                        {category.items.map(({ item, lot }) => (
                          <LotItemCard
                            key={`${lot.id}-${item.id}`}
                            item={item}
                            lot={lot}
                            viewMode={viewMode}
                            onClick={() => setSelectedItem({ item, lot })}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-20 bg-white rounded-lg">
                <div className="w-16 h-16 mx-auto mb-5 bg-[#faf6f1] rounded-full flex items-center justify-center">
                  <ShoppingBag size={28} className="text-[#94786b]" />
                </div>
                <p className="font-[family-name:var(--font-serif)] text-xl text-[#2a181d] mb-2">
                  Aucun article trouvé
                </p>
                <p className="text-[14px] text-[#94786b] mb-6">
                  Modifiez vos filtres pour voir plus d'articles
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
              {/* Prices */}
              <div className="mb-8">
                <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#94786b] mb-4">
                  Budget
                </h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setSelectedPrice(null)}
                      className={clsx(
                        "flex items-center justify-between w-full text-left text-[14px] py-1",
                        selectedPrice === null ? "text-[#2a181d] font-medium" : "text-[#94786b]"
                      )}
                    >
                      <span>Tous les prix</span>
                      <span className="text-[12px]">{allItems.length}</span>
                    </button>
                  </li>
                  {availablePrices.map((price) => (
                    <li key={price}>
                      <button
                        onClick={() => setSelectedPrice(price)}
                        className={clsx(
                          "flex items-center justify-between w-full text-left text-[14px] py-1",
                          selectedPrice === price ? "text-[#2a181d] font-medium" : "text-[#94786b]"
                        )}
                      >
                        <span>{formatShortPrice(price)} FCFA</span>
                        <span className="text-[12px]">{priceCounts[price] || 0}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#94786b] mb-4">
                    Catégorie
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={clsx(
                          "flex items-center justify-between w-full text-left text-[14px] py-1",
                          !selectedCategory ? "text-[#2a181d] font-medium" : "text-[#94786b]"
                        )}
                      >
                        <span>Toutes</span>
                        <span className="text-[12px]">{allItems.length}</span>
                      </button>
                    </li>
                    {categories.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() => setSelectedCategory(category.id)}
                          className={clsx(
                            "flex items-center justify-between w-full text-left text-[14px] py-1",
                            selectedCategory === category.id
                              ? "text-[#2a181d] font-medium"
                              : "text-[#94786b]"
                          )}
                        >
                          <span>{category.name}</span>
                          <span className="text-[12px]">{categoryCounts[category.id] || 0}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
              </div>

              {/* Apply Button */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 bg-[#511F29] text-white text-[12px] font-semibold tracking-wider uppercase"
                >
                  Voir {filteredItems.length} résultat{filteredItems.length !== 1 ? "s" : ""}
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

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedItem && (
          <QuickViewModal
            item={selectedItem.item}
            lot={selectedItem.lot}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
