"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingBag,
  Check,
  X,
  Search,
  Grid3X3,
  Layers,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import type { PriceLotPublic, PriceLotItemPublic } from "@/lib/queries/lots";

// ============================================================
// Types
// ============================================================

interface LotsContentProps {
  lots: PriceLotPublic[];
  availablePrices: number[];
  categories: Array<{ id: string; name: string; slug: string }>;
}

// Flatten items for display
type FlatItem = {
  item: PriceLotItemPublic;
  lot: PriceLotPublic;
};

// ============================================================
// Helpers
// ============================================================

function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-CI").format(price) + " FCFA";
}

function formatShortPrice(price: number): string {
  if (price >= 1000) {
    const k = price / 1000;
    return k === Math.floor(k) ? `${k}k` : `${Math.round(k)}k`;
  }
  return `${price}`;
}

// ============================================================
// Main Component
// ============================================================

type GroupMode = "price" | "category";

export function LotsContent({ lots, availablePrices, categories }: LotsContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<FlatItem | null>(null);
  const [groupMode, setGroupMode] = useState<GroupMode>("price");

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

  // Filter items
  const filteredItems = useMemo(() => {
    return allItems.filter(({ item, lot }) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !lot.name.toLowerCase().includes(query) &&
          !lot.category?.name.toLowerCase().includes(query) &&
          !(item.label?.toLowerCase().includes(query))
        ) {
          return false;
        }
      }
      if (selectedPrice !== null && lot.price !== selectedPrice) {
        return false;
      }
      if (selectedCategory && lot.category?.id !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [allItems, searchQuery, selectedPrice, selectedCategory]);

  // Group by price for display (out-of-stock items at the end of each group)
  const itemsByPrice = useMemo(() => {
    const groups = new Map<number, FlatItem[]>();
    for (const flatItem of filteredItems) {
      const price = flatItem.lot.price;
      if (!groups.has(price)) {
        groups.set(price, []);
      }
      groups.get(price)!.push(flatItem);
    }
    // Sort items within each group: in-stock first, out-of-stock last
    for (const items of groups.values()) {
      items.sort((a, b) => {
        const aOutOfStock = a.item.stock <= 0;
        const bOutOfStock = b.item.stock <= 0;
        if (aOutOfStock && !bOutOfStock) return 1;
        if (!aOutOfStock && bOutOfStock) return -1;
        return 0;
      });
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a - b);
  }, [filteredItems]);

  // Group by category for display (out-of-stock items at the end of each group)
  const itemsByCategory = useMemo(() => {
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

    const result = Array.from(groups.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      items: data.items,
    }));

    // Sort alphabetically by name
    result.sort((a, b) => a.name.localeCompare(b.name));

    // Add no-category items at the end if any
    if (noCategory.items.length > 0) {
      result.push({ id: "no-category", name: noCategory.name, items: noCategory.items });
    }

    // Sort items within each group: in-stock first, out-of-stock last
    for (const group of result) {
      group.items.sort((a, b) => {
        const aOutOfStock = a.item.stock <= 0;
        const bOutOfStock = b.item.stock <= 0;
        if (aOutOfStock && !bOutOfStock) return 1;
        if (!aOutOfStock && bOutOfStock) return -1;
        return 0;
      });
    }

    return result;
  }, [filteredItems]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPrice(null);
    setSelectedCategory(null);
  };

  const hasFilters = searchQuery || selectedPrice !== null || selectedCategory;
  const totalItems = filteredItems.length;

  return (
    <div className="min-h-screen bg-[#fbf9f7]">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-[#511F29] to-[#3d171f] text-center py-16 px-5">
        <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-[#fbf3ec] mb-3">
          Par Budget
        </h1>
        <p className="text-[#fcd3b4]/80 text-lg max-w-md mx-auto">
          Trouvez l'article parfait selon votre budget
        </p>
      </div>

      {/* Search & Filters - Floating */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 clamp(16px, 3vw, 48px)" }} className="-mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Search */}
          <div className="relative mb-5">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94786b]" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#faf6f1] text-[15px] text-[#2a181d] placeholder-[#94786b]/60 focus:outline-none focus:ring-2 focus:ring-[#511F29]/20 transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Price filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#94786b] uppercase tracking-wider font-medium">Budget:</span>
              <button
                onClick={() => setSelectedPrice(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedPrice === null
                    ? "bg-[#511F29] text-white shadow-md"
                    : "bg-[#faf6f1] text-[#511F29] hover:bg-[#f0e8e0]"
                }`}
              >
                Tous
              </button>
              {availablePrices.map((price) => (
                <button
                  key={price}
                  onClick={() => setSelectedPrice(price)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedPrice === price
                      ? "bg-[#511F29] text-white shadow-md"
                      : "bg-[#faf6f1] text-[#511F29] hover:bg-[#f0e8e0]"
                  }`}
                >
                  {formatShortPrice(price)}
                </button>
              ))}
            </div>

            {/* Divider */}
            {categories.length > 0 && (
              <div className="hidden md:block h-8 w-px bg-[#511F29]/10" />
            )}

            {/* Category filters */}
            {categories.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#94786b] uppercase tracking-wider font-medium">Catégorie:</span>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !selectedCategory
                      ? "bg-[#511F29] text-white shadow-md"
                      : "bg-[#faf6f1] text-[#511F29] hover:bg-[#f0e8e0]"
                  }`}
                >
                  Toutes
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? "bg-[#511F29] text-white shadow-md"
                        : "bg-[#faf6f1] text-[#511F29] hover:bg-[#f0e8e0]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto text-sm text-[#94786b] hover:text-[#511F29] underline"
              >
                Effacer tout
              </button>
            )}
          </div>

          {/* Results count + View Toggle */}
          <div className="mt-4 pt-4 border-t border-[#511F29]/5 flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm text-[#94786b]">
              <span className="font-semibold text-[#511F29]">{totalItems}</span> article{totalItems > 1 ? "s" : ""} disponible{totalItems > 1 ? "s" : ""}
            </p>

            {/* Group Toggle */}
            <div className="flex items-center gap-2 bg-[#faf6f1] rounded-full p-1">
              <button
                onClick={() => setGroupMode("price")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  groupMode === "price"
                    ? "bg-[#511F29] text-white shadow-sm"
                    : "text-[#94786b] hover:text-[#511F29]"
                }`}
              >
                <Layers size={16} />
                <span className="hidden sm:inline">Par Prix</span>
              </button>
              <button
                onClick={() => setGroupMode("category")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  groupMode === "category"
                    ? "bg-[#511F29] text-white shadow-sm"
                    : "text-[#94786b] hover:text-[#511F29]"
                }`}
              >
                <Grid3X3 size={16} />
                <span className="hidden sm:inline">Par Catégorie</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px clamp(16px, 3vw, 48px) 80px" }}>
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#511F29]/5 flex items-center justify-center">
              <ShoppingBag size={40} className="text-[#511F29]/30" />
            </div>
            <h3 className="font-[family-name:var(--font-serif)] text-2xl text-[#2a181d] mb-2">
              Aucun article trouvé
            </h3>
            <p className="text-[#94786b] mb-6">
              Essayez de modifier vos filtres
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-[#511F29] text-white rounded-full font-medium hover:bg-[#3d171f] transition-colors"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        ) : groupMode === "price" ? (
          /* =================== BY PRICE =================== */
          <div className="space-y-16">
            {itemsByPrice.map(([price, items]) => (
              <section key={price}>
                {/* Price Section Header */}
                <div className="flex items-center gap-6 mb-8">
                  <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-[#511F29] whitespace-nowrap">
                    {formatShortPrice(price)} FCFA
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#511F29]/20 to-transparent" />
                  <span className="text-sm text-[#94786b] whitespace-nowrap">
                    {items.length} article{items.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {items.map(({ item, lot }) => (
                    <ProductCard
                      key={`${lot.id}-${item.id}`}
                      item={item}
                      lot={lot}
                      onClick={() => setSelectedItem({ item, lot })}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          /* =================== BY CATEGORY =================== */
          <div className="space-y-16">
            {itemsByCategory.map((category) => (
              <section key={category.id}>
                {/* Category Section Header */}
                <div className="flex items-center gap-6 mb-8">
                  <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-[#511F29] whitespace-nowrap">
                    {category.name}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#511F29]/20 to-transparent" />
                  <span className="text-sm text-[#94786b] whitespace-nowrap">
                    {category.items.length} article{category.items.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {category.items.map(({ item, lot }) => (
                    <ProductCard
                      key={`${lot.id}-${item.id}`}
                      item={item}
                      lot={lot}
                      onClick={() => setSelectedItem({ item, lot })}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

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

// ============================================================
// Product Card - Matching Boutique Style
// ============================================================

interface ProductCardProps {
  item: PriceLotItemPublic;
  lot: PriceLotPublic;
  onClick: () => void;
}

function ProductCard({ item, lot, onClick }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = item.stock <= 0;
  const categoryName = lot.category?.name || "";

  const handleAddToCart = (e: React.MouseEvent) => {
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
    <article className="group" style={{ position: "relative", width: "100%", minWidth: 0 }} onClick={onClick}>
      {/* Image Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4/5",
          overflow: "hidden",
          background: "#ece0d3",
          borderRadius: "2px",
          cursor: "pointer",
        }}
      >
        <Image
          src={item.image}
          alt={item.label || lot.name}
          fill
          className="transition-transform duration-700 group-hover:scale-[1.06]"
          style={{ objectFit: "cover", objectPosition: "center 20%" }}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badge */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            background: isOutOfStock ? "#6b6b6b" : "#511F29",
            color: isOutOfStock ? "#ffffff" : "#fcd3b4",
            fontSize: "9.5px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "6px 11px",
            borderRadius: "2px",
            pointerEvents: "none",
          }}
        >
          {isOutOfStock ? "Épuisé" : `${formatShortPrice(lot.price)}`}
        </div>

        {/* Low stock badge */}
        {!isOutOfStock && item.stock <= 3 && (
          <div
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              background: "#2d5a3d",
              color: "#d4f5dc",
              fontSize: "9.5px",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "6px 11px",
              borderRadius: "2px",
              pointerEvents: "none",
            }}
          >
            Plus que {item.stock}
          </div>
        )}

        {/* Add to Cart Button (on hover) */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="opacity-0 group-hover:opacity-100 hide-on-mobile transition-opacity duration-300"
          style={{
            position: "absolute",
            left: "14px",
            right: "14px",
            bottom: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: isOutOfStock ? "rgba(107,107,107,0.9)" : "rgba(81,31,41,0.95)",
            color: "#fbf3ec",
            fontFamily: "var(--font-sans), sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "13px 16px",
            border: "none",
            borderRadius: "2px",
            backdropFilter: "blur(4px)",
            cursor: isOutOfStock ? "not-allowed" : "pointer",
          }}
        >
          {isOutOfStock ? (
            "Indisponible"
          ) : (
            <>
              <ShoppingBag size={14} />
              Ajouter au panier
            </>
          )}
        </button>
      </div>

      {/* Product Info */}
      <div style={{ padding: "18px 2px 0" }}>
        {categoryName && (
          <div
            style={{
              fontSize: "10.5px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#94786b",
              marginBottom: "7px",
            }}
          >
            {categoryName}
          </div>
        )}
        <h3
          style={{
            fontFamily: "var(--font-serif), serif",
            fontWeight: 500,
            fontSize: "19px",
            margin: "0 0 9px",
            color: "#2a181d",
          }}
        >
          {item.label || lot.name}
        </h3>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <span
            style={{
              fontSize: "14.5px",
              fontWeight: 600,
              color: "#511F29",
            }}
          >
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
        className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
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
              <span className="bg-white text-[#511F29] px-6 py-3 rounded-full text-lg font-bold uppercase">
                Épuisé
              </span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#511F29] hover:bg-white transition-colors shadow-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Details */}
        <div className="md:w-1/2 p-8 flex flex-col">
          {lot.category && (
            <span className="text-sm text-[#94786b] uppercase tracking-wider mb-2">
              {lot.category.name}
            </span>
          )}

          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-[#2a181d] mb-2">
            {item.label || lot.name}
          </h2>

          <p className="text-sm text-[#94786b] mb-6">
            {lot.name}
          </p>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl font-bold text-[#511F29]">
              {formatPrice(lot.price)}
            </span>
          </div>

          {/* Stock info */}
          {!isOutOfStock && (
            <div className="flex items-center gap-2 mb-8">
              <div className={`w-2 h-2 rounded-full ${item.stock > 5 ? "bg-green-500" : "bg-orange-500"}`} />
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
              className={`w-full py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-3 transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#511F29] text-white hover:bg-[#3d171f]"
              }`}
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
