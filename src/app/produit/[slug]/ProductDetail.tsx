"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Minus,
  Plus,
  Check,
  AlertTriangle,
} from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useCartStore } from "@/stores/cart-store";
import { LotSelector, type SelectedItem, type LotData } from "./LotSelector";
import type {
  ProductWithCategoryAndLots,
  ProductWithCategory,
} from "@/lib/db/schema";

function formatPrice(price: number | string): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return (
    new Intl.NumberFormat("fr-CI", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(numPrice) + " FCFA"
  );
}

interface ProductDetailProps {
  product: ProductWithCategoryAndLots;
  relatedProducts: ProductWithCategory[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);

  const lots = product.lots || [];
  const hasLots = lots.length > 0;

  // Convert DB lots to LotSelector format with items
  const lotsData: LotData[] = useMemo(() => {
    return lots.map((lot) => {
      // Parse items from JSONB
      const items = (lot.items as Array<{ id: string; image: string; stock: number; label?: string }>) || [];

      // Fallback to legacy format if no items
      const finalItems = items.length > 0
        ? items
        : (lot.images || []).map((image, idx) => ({
            id: `legacy-${lot.id}-${idx}`,
            image,
            stock: Math.floor(lot.stock / (lot.images?.length || 1)),
          }));

      return {
        id: lot.id,
        name: lot.name,
        price: parseFloat(lot.price),
        items: finalItems,
        images: lot.images || [],
        stock: lot.stock,
        is_available: lot.isAvailable,
      };
    });
  }, [lots]);

  // Get quantity already in cart for this item
  const quantityInCart = selectedItem
    ? getItemQuantity(product.id, selectedItem.lotId, selectedItem.itemId)
    : getItemQuantity(product.id);

  // Determine which images to display
  // For lot-based products, show the selected item's image
  // Otherwise show product images
  const displayImages = useMemo(() => {
    if (selectedItem) {
      return [selectedItem.itemImage];
    }
    if (hasLots && lotsData.length > 0) {
      // Show first item of first lot as preview
      const firstItem = lotsData[0]?.items?.[0];
      if (firstItem) {
        return [firstItem.image];
      }
    }
    return product.images || [];
  }, [selectedItem, hasLots, lotsData, product.images]);

  // Determine the current price and stock
  const basePrice = parseFloat(product.price);
  const displayPrice = selectedItem ? selectedItem.lotPrice : basePrice;
  const oldPrice = product.oldPrice ? parseFloat(product.oldPrice) : null;

  // Stock calculation
  const maxStock = selectedItem ? selectedItem.itemStock : product.stock;
  const availableStock = maxStock - quantityInCart;
  const isOutOfStock = maxStock === 0;
  const isLowStock = maxStock > 0 && maxStock <= 5;

  // Total price
  const totalPrice = displayPrice * quantity;

  // Reset quantity and image when item changes
  const handleSelectItem = (item: SelectedItem) => {
    setSelectedItem(item);
    setSelectedImage(0);
    setQuantity(1);
    setStockError(null);
    setAddedToCart(false);
  };

  // Quantity handlers
  const incrementQuantity = () => {
    if (quantity < availableStock) {
      setQuantity((q) => q + 1);
      setStockError(null);
    } else {
      setStockError(
        quantityInCart > 0
          ? `Vous avez déjà ${quantityInCart} article(s) dans votre panier`
          : "Stock maximum atteint"
      );
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
      setStockError(null);
    }
  };

  const handleAddToCart = () => {
    if (hasLots && !selectedItem) {
      return;
    }

    // Check stock
    if (quantity > availableStock) {
      setStockError(
        availableStock <= 0
          ? "Ce produit n'est plus disponible"
          : `Seulement ${availableStock} article(s) disponible(s)`
      );
      return;
    }

    const categoryName = product.category?.name || "";
    const productImage = selectedItem?.itemImage || product.images?.[0] || "/images/placeholder.jpg";

    if (selectedItem) {
      const result = addItem(
        {
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          productImage,
          categoryName,
          price: basePrice,
          stock: product.stock,
          lotId: selectedItem.lotId,
          lotName: selectedItem.lotName,
          lotPrice: selectedItem.lotPrice,
          lotStock: selectedItem.itemStock, // Use item's stock
          itemId: selectedItem.itemId,
          itemLabel: selectedItem.itemLabel,
        },
        quantity
      );

      if (result.stockLimitReached) {
        setStockError("Stock maximum atteint");
      }
    } else {
      addItem(
        {
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          productImage,
          categoryName,
          price: basePrice,
          stock: product.stock,
        },
        quantity
      );
    }

    // Show success feedback
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Check if can add to cart
  const canAddToCart =
    (!hasLots || (selectedItem && selectedItem.itemStock > 0)) &&
    availableStock > 0;

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <>
      <div
        className="product-detail-container"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(30px, 4vw, 50px) clamp(20px, 4vw, 40px) clamp(60px, 8vw, 100px)",
        }}
      >
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Catalogue", href: "/catalogue" },
            ...(product.category
              ? [
                  {
                    label: product.category.name,
                    href: `/catalogue/${product.category.slug}`,
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />

        {/* Product Content */}
        <div className="grid-cols-2-responsive">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div
              style={{
                position: "relative",
                aspectRatio: "4/5",
                overflow: "hidden",
                background: "#fff",
                cursor: displayImages.length > 0 ? "zoom-in" : "default",
                marginBottom: "16px",
              }}
              onClick={() => displayImages.length > 0 && setIsLightboxOpen(true)}
            >
              {displayImages.length > 0 ? (
                <Image
                  src={displayImages[selectedImage]}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f0eb",
                    color: "#94786b",
                  }}
                >
                  Aucune image
                </div>
              )}
              {/* Out of stock overlay for selected item */}
              {selectedItem && selectedItem.itemStock === 0 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      background: "#fff",
                      color: "#511F29",
                      fontSize: "18px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      padding: "12px 24px",
                    }}
                  >
                    Épuisé
                  </span>
                </div>
              )}
              {product.isNew && (
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    background: "#511F29",
                    color: "#fcd3b4",
                    fontSize: "9.5px",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "6px 11px",
                  }}
                >
                  Nouveau
                </span>
              )}
              {product.isBestseller && !product.isNew && (
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    background: "#511F29",
                    color: "#fcd3b4",
                    fontSize: "9.5px",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "6px 11px",
                  }}
                >
                  Best-seller
                </span>
              )}
            </div>

            {/* Thumbnails - only for non-lot products with multiple images */}
            {!hasLots && displayImages.length > 1 && (
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    style={{
                      position: "relative",
                      width: "80px",
                      height: "100px",
                      overflow: "hidden",
                      border:
                        selectedImage === index
                          ? "2px solid #511F29"
                          : "2px solid transparent",
                      opacity: selectedImage === index ? 1 : 0.6,
                      cursor: "pointer",
                      background: "none",
                      padding: 0,
                    }}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Vue ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category */}
            {product.category && (
              <Link
                href={`/catalogue/${product.category.slug}`}
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#511F29",
                  textDecoration: "none",
                  marginBottom: "16px",
                }}
              >
                {product.category.name}
              </Link>
            )}

            {/* Name */}
            <h1
              style={{
                fontFamily: "var(--font-serif), serif",
                fontWeight: 500,
                fontSize: "clamp(28px, 3.5vw, 48px)",
                lineHeight: 1.1,
                color: "#2a181d",
                margin: "0 0 20px",
              }}
            >
              {product.name}
            </h1>

            {/* Price Section - Different display for standard vs lots */}
            {hasLots ? (
              /* LOT-BASED PRODUCT: Show price range and clear indicator */
              <div style={{ marginBottom: "28px" }}>
                {/* Badge indicating multiple options */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "linear-gradient(135deg, #511F29 0%, #6b2a36 100%)",
                    color: "#fcd3b4",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    marginBottom: "16px",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>●</span>
                  {lotsData.reduce((sum, lot) => sum + lot.items.length, 0)} articles disponibles
                </div>

                {/* Price range or selected price */}
                {selectedItem ? (
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-serif), serif",
                        fontSize: "clamp(28px, 3vw, 36px)",
                        fontWeight: 500,
                        color: "#2a181d",
                        margin: 0,
                      }}
                    >
                      {formatPrice(displayPrice)}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#22c55e",
                        fontWeight: 500,
                        margin: "6px 0 0",
                      }}
                    >
                      {selectedItem.lotName}{selectedItem.itemLabel ? ` - ${selectedItem.itemLabel}` : ""} sélectionné
                    </p>
                  </div>
                ) : (
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#94786b",
                        margin: "0 0 4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      À partir de
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-serif), serif",
                        fontSize: "clamp(28px, 3vw, 36px)",
                        fontWeight: 500,
                        color: "#2a181d",
                        margin: 0,
                      }}
                    >
                      {formatPrice(Math.min(...lotsData.map((l) => l.price)))}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* STANDARD PRODUCT: Simple price display */
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "16px",
                  marginBottom: "28px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-serif), serif",
                    fontSize: "clamp(28px, 3vw, 36px)",
                    fontWeight: 500,
                    color: "#2a181d",
                    margin: 0,
                  }}
                >
                  {formatPrice(displayPrice)}
                </p>
                {oldPrice && (
                  <p
                    style={{
                      fontSize: "18px",
                      color: "#94786b",
                      textDecoration: "line-through",
                      margin: 0,
                    }}
                  >
                    {formatPrice(oldPrice)}
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "#6e5a50",
                  margin: "0 0 32px",
                }}
              >
                {product.description}
              </p>
            )}

            {/* Lot/Item Selector - Step 1 */}
            {hasLots && (
              <LotSelector
                lots={lotsData}
                selectedItem={selectedItem}
                onSelectItem={handleSelectItem}
              />
            )}

            {/* Quantity Selector - Step 2 (only shows when item is selected or no lots) */}
            {(!hasLots || selectedItem) && !isOutOfStock && (
              <div style={{ marginBottom: "24px" }}>
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "#511F29",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      {hasLots ? "2" : "1"}
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#2a181d",
                      }}
                    >
                      Quantité
                    </span>
                  </div>

                  {/* Stock indicator */}
                  {isLowStock ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                        color: "#d97706",
                        fontWeight: 500,
                      }}
                    >
                      <AlertTriangle size={14} />
                      Plus que {maxStock} en stock
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#22c55e",
                        fontWeight: 500,
                      }}
                    >
                      {maxStock} disponible(s)
                    </span>
                  )}
                </div>

                {/* Quantity controls */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid rgba(81,31,41,0.2)",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      style={{
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: quantity <= 1 ? "#f5f5f5" : "#faf6f1",
                        border: "none",
                        cursor: quantity <= 1 ? "not-allowed" : "pointer",
                        color: quantity <= 1 ? "#ccc" : "#511F29",
                        transition: "all 0.2s",
                      }}
                      aria-label="Diminuer la quantité"
                    >
                      <Minus size={18} />
                    </button>
                    <div
                      style={{
                        width: "64px",
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#2a181d",
                        background: "#fff",
                        borderLeft: "1px solid rgba(81,31,41,0.1)",
                        borderRight: "1px solid rgba(81,31,41,0.1)",
                      }}
                    >
                      {quantity}
                    </div>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= availableStock}
                      style={{
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: quantity >= availableStock ? "#f5f5f5" : "#faf6f1",
                        border: "none",
                        cursor: quantity >= availableStock ? "not-allowed" : "pointer",
                        color: quantity >= availableStock ? "#ccc" : "#511F29",
                        transition: "all 0.2s",
                      }}
                      aria-label="Augmenter la quantité"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* Total price */}
                  {quantity > 1 && (
                    <div>
                      <span style={{ fontSize: "13px", color: "#94786b" }}>Total: </span>
                      <span
                        style={{
                          fontFamily: "var(--font-serif), serif",
                          fontSize: "20px",
                          fontWeight: 600,
                          color: "#511F29",
                        }}
                      >
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stock warning/error message */}
                {stockError && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "12px",
                      padding: "10px 14px",
                      background: "rgba(220,38,38,0.1)",
                      borderRadius: "6px",
                      color: "#dc2626",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    <AlertTriangle size={16} />
                    {stockError}
                  </div>
                )}

                {/* Info about items already in cart */}
                {quantityInCart > 0 && (
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#94786b",
                      margin: "12px 0 0",
                    }}
                  >
                    Vous avez déjà {quantityInCart} article(s) dans votre panier
                  </p>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  background: addedToCart
                    ? "#22c55e"
                    : canAddToCart
                      ? "#511F29"
                      : "#94786b",
                  color: addedToCart ? "#fff" : "#fcd3b4",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "18px 36px",
                  border: "none",
                  borderRadius: "2px",
                  cursor: canAddToCart ? "pointer" : "not-allowed",
                  opacity: canAddToCart || addedToCart ? 1 : 0.7,
                  transition: "all 0.3s",
                }}
              >
                {addedToCart ? (
                  <>
                    <Check size={20} />
                    <span>Ajouté au panier</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    <span>
                      {hasLots && !selectedItem
                        ? "Sélectionnez un article"
                        : isOutOfStock
                          ? "Épuisé"
                          : `Ajouter au panier${quantity > 1 ? ` (${quantity})` : ""}`}
                    </span>
                  </>
                )}
              </button>

            </div>

            <p
              style={{
                fontSize: "13px",
                color: "#94786b",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              Livraison disponible à Abidjan et environs
            </p>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: "clamp(60px, 8vw, 100px)" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div
                style={{
                  fontSize: "11.5px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#94786b",
                  marginBottom: "14px",
                }}
              >
                Vous aimerez aussi
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-serif), serif",
                  fontWeight: 500,
                  fontSize: "clamp(28px, 3vw, 42px)",
                  lineHeight: 1,
                  color: "#2a181d",
                  margin: 0,
                }}
              >
                Produits Similaires
              </h2>
            </div>

            <div className="grid-cols-4-responsive">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && displayImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(42,24,29,0.95)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                padding: "12px",
                color: "#fff",
                background: "rgba(0,0,0,0.5)",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                zIndex: 10000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Fermer"
            >
              <X size={28} />
            </button>

            {/* Navigation */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  style={{
                    position: "absolute",
                    left: "24px",
                    padding: "8px",
                    color: "rgba(255,255,255,0.7)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  aria-label="Image précédente"
                >
                  <ChevronLeft size={40} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  style={{
                    position: "absolute",
                    right: "24px",
                    padding: "8px",
                    color: "rgba(255,255,255,0.7)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  aria-label="Image suivante"
                >
                  <ChevronRight size={40} />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                maxWidth: "1000px",
                maxHeight: "80vh",
                margin: "0 16px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={displayImages[selectedImage]}
                alt={product.name}
                fill
                style={{ objectFit: "contain" }}
                sizes="100vw"
              />
            </motion.div>

            {/* Dots */}
            {displayImages.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "32px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "8px",
                }}
              >
                {displayImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(index);
                    }}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background:
                        selectedImage === index ? "#fcd3b4" : "rgba(255,255,255,0.3)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    aria-label={`Image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
