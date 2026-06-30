"use client";

import Image from "next/image";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { getProductById, formatPrice } from "@/data/products";

export function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    getItemCount,
  } = useCartStore();

  const cartItems = Object.entries(items).map(([productId, quantity]) => {
    const product = getProductById(productId);
    return { product, quantity };
  }).filter((item) => item.product !== undefined);

  const subtotal = cartItems.reduce((acc, { product, quantity }) => {
    if (!product) return acc;
    return acc + product.price * quantity;
  }, 0);

  const itemCount = getItemCount();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[70] transition-opacity"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-[420px] z-[80] flex flex-col"
        style={{
          backgroundColor: "var(--som-cream)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: "rgba(81, 31, 41, 0.12)" }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5" style={{ color: "var(--som-burgundy)" }} strokeWidth={1.5} />
            <h2
              className="font-[family-name:var(--font-playfair-display)]"
              style={{
                fontSize: "22px",
                fontWeight: 500,
                color: "var(--som-text)",
              }}
            >
              Votre Panier
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
              style={{
                backgroundColor: "var(--som-burgundy)",
                color: "var(--som-peach)",
              }}
            >
              {itemCount}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" style={{ color: "var(--som-text)" }} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag
                className="w-16 h-16 mb-4"
                style={{ color: "var(--som-text-muted)" }}
                strokeWidth={1}
              />
              <p
                className="font-[family-name:var(--font-playfair-display)] text-xl mb-2"
                style={{ color: "var(--som-text)" }}
              >
                Votre panier est vide
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--som-text-muted)" }}
              >
                Découvrez nos collections et trouvez la pièce parfaite
              </p>
              <button
                onClick={closeCart}
                className="btn-primary mt-6"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(({ product, quantity }) => {
                if (!product) return null;
                return (
                  <div
                    key={product.id}
                    className="flex gap-4 pb-4 border-b"
                    style={{ borderColor: "rgba(81, 31, 41, 0.1)" }}
                  >
                    {/* Product Image */}
                    <div className="relative w-[90px] h-[110px] flex-shrink-0 rounded-[2px] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="90px"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p
                          className="text-[10px] uppercase tracking-[0.14em] mb-1"
                          style={{ color: "var(--som-text-muted)" }}
                        >
                          {product.category}
                        </p>
                        <h3
                          className="font-[family-name:var(--font-playfair-display)] text-[15px] leading-tight mb-1"
                          style={{ color: "var(--som-text)" }}
                        >
                          {product.name}
                        </h3>
                        <p
                          className="text-[13px] font-semibold"
                          style={{ color: "var(--som-burgundy)" }}
                        >
                          {formatPrice(product.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div
                          className="flex items-center gap-1 border rounded-[2px]"
                          style={{ borderColor: "rgba(81, 31, 41, 0.2)" }}
                        >
                          <button
                            onClick={() => decrementItem(product.id)}
                            className="p-1.5 hover:bg-black/5 transition-colors"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span
                            className="px-2 text-sm font-medium min-w-[24px] text-center"
                            style={{ color: "var(--som-text)" }}
                          >
                            {quantity}
                          </span>
                          <button
                            onClick={() => incrementItem(product.id)}
                            className="p-1.5 hover:bg-black/5 transition-colors"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="p-1.5 hover:bg-red-50 rounded transition-colors text-red-600"
                          aria-label="Supprimer l'article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div
            className="border-t px-6 py-5"
            style={{ borderColor: "rgba(81, 31, 41, 0.12)" }}
          >
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-sm uppercase tracking-[0.1em]"
                style={{ color: "var(--som-text-light)" }}
              >
                Sous-total
              </span>
              <span
                className="font-[family-name:var(--font-playfair-display)] text-xl"
                style={{ color: "var(--som-text)" }}
              >
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Info */}
            <p
              className="text-[12px] text-center mb-4"
              style={{ color: "var(--som-text-muted)" }}
            >
              Frais de livraison calculés à la prochaine étape
            </p>

            {/* Checkout Button */}
            <button className="btn-primary w-full mb-3">
              Commander via WhatsApp
            </button>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="w-full text-center text-[12px] py-2 transition-colors hover:text-red-600"
              style={{ color: "var(--som-text-muted)" }}
            >
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </>
  );
}
