"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
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
    getItemCount,
  } = useCartStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartItems = Object.entries(items)
    .map(([productId, quantity]) => {
      const product = getProductById(productId);
      return { product, quantity };
    })
    .filter((item) => item.product !== undefined);

  const subtotal = cartItems.reduce((acc, { product, quantity }) => {
    if (!product) return acc;
    return acc + product.price * quantity;
  }, 0);

  const itemCount = getItemCount();
  const hasItems = cartItems.length > 0;

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 85,
              background: "rgba(31,17,22,0.5)",
              backdropFilter: "blur(3px)",
            }}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 86,
              width: "min(424px,100%)",
              background: "#faf6f1",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-20px 0 60px rgba(31,17,22,0.28)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "24px 26px",
                borderBottom: "1px solid rgba(81,31,41,0.12)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "23px",
                  color: "#2a181d",
                }}
              >
                Votre panier{" "}
                <span style={{ fontSize: "14px", color: "#94786b" }}>
                  ({itemCount})
                </span>
              </div>
              <button
                onClick={closeCart}
                aria-label="Fermer"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#2a181d",
                  lineHeight: 0,
                  padding: "2px",
                }}
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Empty State */}
            {!hasItems && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "18px",
                  padding: "48px 40px",
                  textAlign: "center",
                }}
              >
                <ShoppingBag size={40} color="#c7ab9b" strokeWidth={1.3} />
                <div
                  style={{
                    fontSize: "14.5px",
                    color: "#6e5a50",
                    lineHeight: 1.6,
                  }}
                >
                  Votre panier est vide.
                  <br />
                  Découvrez nos pièces d&apos;exception.
                </div>
                <button
                  onClick={closeCart}
                  style={{
                    background: "#511F29",
                    color: "#fcd3b4",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "14px 28px",
                    borderRadius: "2px",
                  }}
                >
                  Découvrir la collection
                </button>
              </div>
            )}

            {/* Cart Items */}
            {hasItems && (
              <>
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "4px 26px",
                  }}
                >
                  {cartItems.map(({ product, quantity }) => {
                    if (!product) return null;
                    return (
                      <div
                        key={product.id}
                        style={{
                          display: "flex",
                          gap: "14px",
                          padding: "18px 0",
                          borderBottom: "1px solid rgba(81,31,41,0.08)",
                        }}
                      >
                        {/* Image */}
                        <div
                          style={{
                            width: "70px",
                            height: "88px",
                            flexShrink: 0,
                            overflow: "hidden",
                            borderRadius: "2px",
                            background: "#ece0d3",
                            position: "relative",
                          }}
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            style={{
                              objectFit: "cover",
                              objectPosition: "center 20%",
                            }}
                            sizes="70px"
                          />
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "9.5px",
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              color: "#94786b",
                            }}
                          >
                            {product.category}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              fontSize: "15.5px",
                              color: "#2a181d",
                              margin: "3px 0 10px",
                              lineHeight: 1.2,
                            }}
                          >
                            {product.name}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "10px",
                            }}
                          >
                            {/* Quantity Controls */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid rgba(81,31,41,0.2)",
                                borderRadius: "3px",
                              }}
                            >
                              <button
                                onClick={() => decrementItem(product.id)}
                                aria-label="Moins"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#511F29",
                                  fontSize: "16px",
                                  lineHeight: 1,
                                }}
                              >
                                −
                              </button>
                              <span
                                style={{
                                  minWidth: "26px",
                                  textAlign: "center",
                                  fontSize: "13px",
                                  color: "#2a181d",
                                }}
                              >
                                {quantity}
                              </span>
                              <button
                                onClick={() => incrementItem(product.id)}
                                aria-label="Plus"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#511F29",
                                  fontSize: "15px",
                                  lineHeight: 1,
                                }}
                              >
                                +
                              </button>
                            </div>
                            <div
                              style={{
                                fontSize: "13.5px",
                                fontWeight: 600,
                                color: "#511F29",
                              }}
                            >
                              {formatPrice(product.price * quantity)}
                            </div>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(product.id)}
                          aria-label="Retirer"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#b09a8d",
                            lineHeight: 0,
                            padding: "2px",
                            alignSelf: "flex-start",
                          }}
                        >
                          <X size={16} strokeWidth={1.6} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div
                  style={{
                    padding: "22px 26px",
                    borderTop: "1px solid rgba(81,31,41,0.12)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      marginBottom: "5px",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: "#6e5a50" }}>
                      Sous-total
                    </span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "21px",
                        color: "#2a181d",
                      }}
                    >
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "11.5px",
                      color: "#94786b",
                      marginBottom: "18px",
                    }}
                  >
                    Livraison calculée à la commande · Abidjan 24h
                  </div>
                  <Link
                    href="/commande"
                    onClick={closeCart}
                    style={{
                      display: "block",
                      width: "100%",
                      background: "#511F29",
                      color: "#fcd3b4",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      padding: "16px",
                      borderRadius: "2px",
                      textAlign: "center",
                      textDecoration: "none",
                      transition: "all 0.25s",
                    }}
                  >
                    Passer la commande
                  </Link>
                  <button
                    onClick={closeCart}
                    style={{
                      display: "block",
                      width: "100%",
                      background: "transparent",
                      color: "#511F29",
                      border: "1px solid rgba(81,31,41,0.3)",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      padding: "13px",
                      borderRadius: "2px",
                      marginTop: "10px",
                      transition: "all 0.25s",
                    }}
                  >
                    Continuer mes achats
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
