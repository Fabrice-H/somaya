"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import type { HomePageProduct } from "@/features/home/server/queries";
import { useCartStore } from "@/features/cart/store";
import { useWishlistStore } from "@/features/wishlist/store";

// ============================================================
// Types
// ============================================================

interface ProductCardProps {
  product: HomePageProduct;
  priority?: boolean;
  showBadge?: boolean;
  /** Open a detail view instead of navigating to /produit (e.g. lot items) */
  onOpen?: () => void;
  /** Replace the default add-to-cart behaviour */
  onAddToCart?: () => void;
  showWishlist?: boolean;
}

// ============================================================
// Helper function
// ============================================================

function formatPrice(price: number): string {
  return (
    new Intl.NumberFormat("fr-CI", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(price) + " FCFA"
  );
}

// ============================================================
// Client Component - ProductCard
// ============================================================

export function ProductCard({
  product,
  priority = false,
  showBadge = true,
  onOpen,
  onAddToCart,
  showWishlist = true,
}: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  // Get first image
  const mainImage = product.images[0] || "/images/placeholder.jpg";

  // Get available lots
  const lotsWithPrice = product.lots.filter(
    (lot) => lot.isAvailable && lot.price > 0,
  );
  const minLotPrice =
    lotsWithPrice.length > 0
      ? Math.min(...lotsWithPrice.map((lot) => lot.price))
      : null;

  // Check if product is out of stock (based on lots availability)
  // Out of stock: every lot unavailable, or (no lots) product stock at 0
  const isOutOfStock =
    product.lots.length > 0
      ? lotsWithPrice.length === 0
      : product.stock !== undefined && product.stock <= 0;

  // Check if product has multiple lots (requires selection)
  const hasMultipleLots = lotsWithPrice.length > 1;
  const singleLot = lotsWithPrice.length === 1 ? lotsWithPrice[0] : null;

  // Display price (use lot price if available, otherwise product price)
  const displayPrice = minLotPrice || product.price;
  const hasMultiplePrices = lotsWithPrice.length > 1;

  // Use slug for URL, fallback to id
  const productUrl = `/produit/${product.slug || product.id}`;

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    if (onAddToCart) {
      onAddToCart();
      return;
    }

    // If multiple lots, redirect to product page to select
    if (hasMultipleLots) {
      router.push(productUrl);
      return;
    }

    // Add to cart (single lot or no lots)
    if (singleLot) {
      addItem({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug || product.id,
        productImage: mainImage,
        categoryName: product.category?.name || "",
        price: product.price,
        stock: product.stock ?? 999,
        lotId: singleLot.id,
        lotName: singleLot.name,
        lotPrice: singleLot.price,
        lotStock: singleLot.stock,
      });
    } else {
      addItem({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug || product.id,
        productImage: mainImage,
        categoryName: product.category?.name || "",
        price: product.price,
        stock: product.stock ?? 999,
      });
    }
  };

  const isOnSale =
    !!product.oldPrice && product.oldPrice > displayPrice && !hasMultiplePrices;
  const discount = isOnSale
    ? Math.round((1 - displayPrice / product.oldPrice!) * 100)
    : 0;
  const hoverImage = product.images[1];

  // Up to 2 badges: status first (new / best-seller / must-have), then the discount
  const badges: { text: string; tone: "light" | "accent" }[] = [];
  if (!isOutOfStock) {
    if (product.isNew) badges.push({ text: "Nouveau", tone: "light" });
    else if (product.isBestseller)
      badges.push({ text: "Best-seller", tone: "light" });
    else if (product.isFeatured)
      badges.push({ text: "Must-have", tone: "light" });
    if (discount > 0) badges.push({ text: `−${discount} %`, tone: "accent" });
    // Scarcity hint for single-stock items (no lots)
    if (
      product.lots.length === 0 &&
      product.stock !== undefined &&
      product.stock > 0 &&
      product.stock <= 3
    )
      badges.push({ text: `Plus que ${product.stock}`, tone: "light" });
  }

  const isWishlisted = useWishlistStore((state) =>
    state.productIds.includes(product.id),
  );
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  const cartLabel = isOutOfStock
    ? "Produit épuisé"
    : hasMultipleLots
      ? `Choisir une option pour ${product.name}`
      : `Ajouter ${product.name} au panier`;

  return (
    <article className="group relative w-full min-w-0">
      {/* Media - warm neutral backdrop, no zoom */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--som-primary-50)]">
        <MediaLink href={productUrl} onOpen={onOpen}>
          <Image
            src={mainImage}
            alt={product.name}
            fill
            priority={priority}
            className={`object-cover transition-opacity duration-[1200ms] ease-[cubic-bezier(0.33,0,0.2,1)] motion-reduce:transition-none ${
              hoverImage && !isOutOfStock ? "group-hover:opacity-0" : ""
            } ${isOutOfStock ? "opacity-55" : ""}`}
            style={{ objectPosition: "center 20%" }}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
          />
          {hoverImage && !isOutOfStock && (
            <Image
              src={hoverImage}
              alt=""
              fill
              className="object-cover opacity-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.33,0,0.2,1)] group-hover:opacity-100 motion-reduce:transition-none"
              style={{ objectPosition: "center 20%" }}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
            />
          )}
        </MediaLink>

        {/* Badges - small white labels, top right */}
        {showBadge && (badges.length > 0 || isOutOfStock) && (
          <ul className="pointer-events-none absolute right-2.5 top-2.5 m-0 flex list-none flex-col items-end gap-1.5 p-0 md:right-3 md:top-3">
            {isOutOfStock ? (
              <li className="bg-white px-2 py-[5px] text-[9px] font-normal uppercase leading-none tracking-[0.12em] text-[#6b6b6b]">
                Épuisé
              </li>
            ) : (
              badges.map((badge) => (
                <li
                  key={badge.text}
                  className={`bg-white px-2 py-[5px] text-[9px] font-normal uppercase leading-none tracking-[0.12em] tabular-nums ${
                    badge.tone === "accent"
                      ? "text-[var(--som-accent-deep)]"
                      : "text-[var(--som-ink)]"
                  }`}
                >
                  {badge.text}
                </li>
              ))
            )}
          </ul>
        )}

        {/* Add to cart - white disc, fades in slowly on desktop, always visible on touch */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={cartLabel}
            title={hasMultipleLots ? "Choisir une option" : "Ajouter au panier"}
            className="group/cart absolute bottom-2 right-2 flex h-11 w-11 cursor-pointer items-center justify-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.33,0,0.2,1)] focus-visible:translate-y-0 focus-visible:opacity-100 motion-reduce:transition-none md:bottom-3 md:right-3 md:translate-y-1.5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--som-ink)] shadow-[0_4px_14px_-6px_rgba(0,0,0,0.25)] transition-colors duration-300 group-hover/cart:bg-[var(--som-primary)] group-hover/cart:text-white group-active/cart:scale-95">
              <ShoppingBag size={16} strokeWidth={1.3} aria-hidden />
            </span>
          </button>
        )}
      </div>

      {/* Caption - left aligned: name + heart, price */}
      <div className="pt-3 md:pt-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="m-0 min-w-0 text-[14px] font-normal! leading-snug text-[var(--som-ink)]">
            {onOpen ? (
              <button
                type="button"
                onClick={onOpen}
                aria-haspopup="dialog"
                className="line-clamp-2 cursor-pointer text-left transition-opacity duration-300 hover:opacity-60"
              >
                {product.name}
              </button>
            ) : (
              <Link
                href={productUrl}
                className="line-clamp-2 transition-opacity duration-300 hover:opacity-60"
              >
                {product.name}
              </Link>
            )}
          </h3>
          {showWishlist && (
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={isWishlisted}
              aria-label={
                isWishlisted
                  ? `Retirer ${product.name} des favoris`
                  : `Ajouter ${product.name} aux favoris`
              }
              className={`-my-3 -mr-3 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center transition-[color,transform] duration-300 active:scale-90 ${
                isWishlisted
                  ? "text-[var(--som-accent-deep)]"
                  : "text-[#6b6b6b] hover:text-[var(--som-ink)]"
              }`}
            >
              <Heart
                size={16}
                strokeWidth={1.3}
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </button>
          )}
        </div>
        <p className="m-0 mt-1 flex flex-wrap items-baseline gap-x-2 tabular-nums">
          {isOnSale && (
            <s className="text-[14px] font-light text-[#8a8a8a] decoration-[#8a8a8a]/80">
              <span className="sr-only">Prix initial : </span>
              {formatPrice(product.oldPrice!)}
            </s>
          )}
          <span
            className={`text-[14px] font-normal ${
              isOutOfStock
                ? "text-[#9a9a9a]"
                : isOnSale
                  ? "text-[var(--som-accent-deep)]"
                  : "text-[var(--som-ink)]"
            }`}
          >
            {isOnSale && <span className="sr-only">Prix soldé : </span>}
            {hasMultiplePrices ? "Dès " : ""}
            {formatPrice(displayPrice)}
          </span>
        </p>
      </div>
    </article>
  );
}

// Image area: link to the product page, or a button opening a detail view
function MediaLink({
  href,
  onOpen,
  children,
}: {
  href: string;
  onOpen?: () => void;
  children: React.ReactNode;
}) {
  if (onOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        tabIndex={-1}
        aria-hidden
        className="relative block h-full w-full cursor-pointer"
      >
        {children}
      </button>
    );
  }
  return (
    <Link href={href} className="relative block h-full" tabIndex={-1} aria-hidden>
      {children}
    </Link>
  );
}
