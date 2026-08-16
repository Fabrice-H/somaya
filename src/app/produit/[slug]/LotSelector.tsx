"use client";

import { memo } from "react";
import Image from "next/image";
import { Check, AlertCircle } from "lucide-react";

export interface LotItemData {
  id: string;
  image: string;
  stock: number;
  label?: string;
}

export interface LotData {
  id: string;
  name: string;
  price: number;
  items: LotItemData[];
  // Legacy fields (for backward compat)
  images?: string[];
  stock?: number;
  is_available: boolean;
}

export interface SelectedItem {
  lotId: string;
  lotName: string;
  lotPrice: number;
  itemId: string;
  itemImage: string;
  itemStock: number;
  itemLabel?: string;
}

interface LotSelectorProps {
  lots: LotData[];
  selectedItem: SelectedItem | null;
  onSelectItem: (item: SelectedItem) => void;
}

function formatPrice(price: number): string {
  return (
    new Intl.NumberFormat("fr-CI", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(price) + " FCFA"
  );
}

// Helper to migrate legacy format to items
function getLotItems(lot: LotData): LotItemData[] {
  if (lot.items && lot.items.length > 0) {
    return lot.items;
  }
  // Legacy migration: convert images to items
  if (lot.images && lot.images.length > 0) {
    const stockPerItem = Math.floor((lot.stock || 0) / lot.images.length);
    return lot.images.map((image, idx) => ({
      id: `legacy-${lot.id}-${idx}`,
      image,
      stock: stockPerItem,
    }));
  }
  return [];
}

export const LotSelector = memo(function LotSelector({
  lots,
  selectedItem,
  onSelectItem,
}: LotSelectorProps) {
  if (!lots || lots.length === 0) {
    return null;
  }

  // Calculate price range for display
  const minPrice = Math.min(...lots.map((l) => l.price));
  const maxPrice = Math.max(...lots.map((l) => l.price));
  const hasPriceRange = minPrice !== maxPrice;

  // Check if any item is available
  const hasAvailableItems = lots.some((lot) => {
    const items = getLotItems(lot);
    return lot.is_available && items.some((item) => item.stock > 0);
  });

  return (
    <div
      style={{
        marginBottom: "28px",
        background: "#faf6f1",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: selectedItem ? "#22c55e" : "#511F29",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {selectedItem ? <Check size={16} /> : "1"}
          </span>
          <div>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#2a181d",
                display: "block",
              }}
            >
              Choisissez votre article
            </span>
            {hasPriceRange && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#94786b",
                }}
              >
                De {formatPrice(minPrice)} à {formatPrice(maxPrice)}
              </span>
            )}
          </div>
        </div>
        {!selectedItem && hasAvailableItems && (
          <span
            style={{
              fontSize: "11px",
              color: "#fff",
              fontWeight: 600,
              background: "#dc2626",
              padding: "4px 10px",
              borderRadius: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Requis
          </span>
        )}
      </div>

      {/* Lots */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {lots.map((lot) => {
          const items = getLotItems(lot);
          const availableItemsCount = items.filter((item) => item.stock > 0).length;
          const isLotDisabled = !lot.is_available || availableItemsCount === 0;

          return (
            <div key={lot.id}>
              {/* Lot Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid rgba(81,31,41,0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "15px",
                      color: isLotDisabled ? "#999" : "#2a181d",
                    }}
                  >
                    {lot.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-serif), serif",
                      fontSize: "18px",
                      fontWeight: 600,
                      color: isLotDisabled ? "#999" : "#511F29",
                    }}
                  >
                    {formatPrice(lot.price)}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: isLotDisabled ? "#dc2626" : "#94786b",
                    fontWeight: 500,
                  }}
                >
                  {isLotDisabled
                    ? "Épuisé"
                    : `${availableItemsCount} article${availableItemsCount > 1 ? "s" : ""} disponible${availableItemsCount > 1 ? "s" : ""}`}
                </span>
              </div>

              {/* Items Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                  gap: "10px",
                }}
              >
                {items.map((item) => {
                  const isSelected =
                    selectedItem?.lotId === lot.id && selectedItem?.itemId === item.id;
                  const isOutOfStock = item.stock === 0;
                  const isLowStock = item.stock > 0 && item.stock <= 3;
                  const isDisabled = !lot.is_available || isOutOfStock;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (!isDisabled) {
                          onSelectItem({
                            lotId: lot.id,
                            lotName: lot.name,
                            lotPrice: lot.price,
                            itemId: item.id,
                            itemImage: item.image,
                            itemStock: item.stock,
                            itemLabel: item.label,
                          });
                        }
                      }}
                      disabled={isDisabled}
                      style={{
                        position: "relative",
                        aspectRatio: "4/5",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: isSelected
                          ? "3px solid #511F29"
                          : isDisabled
                            ? "2px solid #e5e5e5"
                            : "2px solid transparent",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        background: "#fff",
                        padding: 0,
                        transition: "all 0.2s ease",
                        boxShadow: isSelected
                          ? "0 4px 12px rgba(81,31,41,0.2)"
                          : "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                      title={item.label || `Article ${item.id}`}
                    >
                      {/* Image */}
                      <Image
                        src={item.image}
                        alt={item.label || "Article"}
                        fill
                        style={{
                          objectFit: "cover",
                          filter: isOutOfStock ? "grayscale(100%)" : "none",
                        }}
                        sizes="100px"
                      />

                      {/* Out of stock overlay */}
                      {isOutOfStock && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.65)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "9px",
                              fontWeight: 700,
                              color: "#fff",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            Épuisé
                          </span>
                        </div>
                      )}

                      {/* Low stock indicator */}
                      {isLowStock && !isOutOfStock && (
                        <div
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            background: "rgba(217,119,6,0.9)",
                            color: "#fff",
                            fontSize: "8px",
                            fontWeight: 700,
                            padding: "2px 5px",
                            borderRadius: "3px",
                          }}
                        >
                          {item.stock}
                        </div>
                      )}

                      {/* Selected indicator */}
                      {isSelected && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "4px",
                            right: "4px",
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            background: "#511F29",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          }}
                        >
                          <Check size={14} color="#fcd3b4" />
                        </div>
                      )}

                      {/* Label overlay */}
                      {item.label && !isOutOfStock && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: "4px 6px",
                            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "9px",
                              fontWeight: 600,
                              color: "#fff",
                              display: "block",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.label}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected item confirmation */}
      {selectedItem && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            background: "rgba(34,197,94,0.1)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "48px",
              height: "60px",
              borderRadius: "6px",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Image
              src={selectedItem.itemImage}
              alt="Article sélectionné"
              fill
              style={{ objectFit: "cover" }}
              sizes="48px"
            />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#22c55e",
                margin: 0,
              }}
            >
              Article sélectionné
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "#2a181d",
                margin: "2px 0 0",
              }}
            >
              {selectedItem.lotName}{selectedItem.itemLabel ? ` - ${selectedItem.itemLabel}` : ""} • <strong>{formatPrice(selectedItem.lotPrice)}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Helpful message if no item selected */}
      {!selectedItem && hasAvailableItems && (
        <p
          style={{
            fontSize: "13px",
            color: "#94786b",
            margin: "14px 0 0",
            textAlign: "center",
          }}
        >
          Cliquez sur une image pour sélectionner votre article
        </p>
      )}
    </div>
  );
});
