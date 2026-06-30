"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useCartStore } from "@/stores/cart-store";
import {
  type Product,
  formatPrice,
  getWhatsAppLink,
  categories,
} from "@/data/products";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const category = categories.find((c) => c.name.toLowerCase() === product.category.toLowerCase());

  const handleAddToCart = () => {
    addItem(product.id);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  return (
    <>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(30px, 4vw, 50px) 40px clamp(60px, 8vw, 100px)",
        }}
      >
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Catalogue", href: "/catalogue" },
            ...(category ? [{ label: category.name, href: `/catalogue/${category.slug}` }] : []),
            { label: product.name },
          ]}
        />

        {/* Product Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(40px, 5vw, 80px)",
            alignItems: "start",
          }}
        >
          {/* Images */}
          <div>
            {/* Main Image */}
            <div
              style={{
                position: "relative",
                aspectRatio: "4/5",
                overflow: "hidden",
                background: "#fff",
                cursor: "zoom-in",
                marginBottom: "16px",
              }}
              onClick={() => setIsLightboxOpen(true)}
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
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

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{ display: "flex", gap: "12px" }}>
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    style={{
                      position: "relative",
                      width: "80px",
                      height: "100px",
                      overflow: "hidden",
                      border: selectedImage === index ? "2px solid #511F29" : "2px solid transparent",
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
            {category && (
              <Link
                href={`/catalogue/${category.slug}`}
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
                {category.name}
              </Link>
            )}

            {/* Name */}
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 500,
                fontSize: "clamp(28px, 3.5vw, 48px)",
                lineHeight: 1.1,
                color: "#2a181d",
                margin: "0 0 20px",
              }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "28px" }}>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(24px, 2.5vw, 32px)",
                  fontWeight: 500,
                  color: "#2a181d",
                  margin: 0,
                }}
              >
                {formatPrice(product.price)}
              </p>
              {product.oldPrice && (
                <p
                  style={{
                    fontSize: "18px",
                    color: "#94786b",
                    textDecoration: "line-through",
                    margin: 0,
                  }}
                >
                  {formatPrice(product.oldPrice)}
                </p>
              )}
            </div>

            {/* Description */}
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

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={handleAddToCart}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  background: "#511F29",
                  color: "#fcd3b4",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "18px 36px",
                  border: "none",
                  borderRadius: "2px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                <ShoppingBag size={20} />
                <span>Ajouter au panier</span>
              </button>

              <a
                href={getWhatsAppLink(product)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  background: "transparent",
                  color: "#511F29",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "16px 36px",
                  textDecoration: "none",
                  borderRadius: "2px",
                  border: "1px solid rgba(81,31,41,0.3)",
                  transition: "all 0.3s",
                }}
              >
                <MessageCircle size={20} />
                <span>Commander sur WhatsApp</span>
              </a>
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
                  fontFamily: "'Playfair Display', serif",
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
              }}
            >
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(42,24,29,0.95)",
              zIndex: 50,
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
                top: "24px",
                right: "24px",
                padding: "8px",
                color: "rgba(255,255,255,0.7)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Fermer"
            >
              <X size={32} />
            </button>

            {/* Navigation */}
            {product.images.length > 1 && (
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
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                style={{ objectFit: "contain" }}
                sizes="100vw"
              />
            </motion.div>

            {/* Dots */}
            {product.images.length > 1 && (
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
                {product.images.map((_, index) => (
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
                      background: selectedImage === index ? "#fcd3b4" : "rgba(255,255,255,0.3)",
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
