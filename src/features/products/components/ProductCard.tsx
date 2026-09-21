"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import type { ProductSummary } from "@/features/products/types";
import { useCartStore } from "@/features/cart/store";
import { useWishlistStore } from "@/features/wishlist/store";
import { formatPrice } from "@/shared/lib/format";
import { availableLots, effectivePrice, isOnSale, isOutOfStock, productBadges } from "../utils";

interface ProductCardProps {
  product: ProductSummary;
  priority?: boolean;
  showBadge?: boolean;
  onOpen?: () => void;
  onAddToCart?: () => void;
  showWishlist?: boolean;
}

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

  const mainImage = product.images[0] || "/images/logo_mark.png";
  const hoverImage = product.images[1];
  const lots = availableLots(product);
  const hasMultipleLots = lots.length > 1;
  const singleLot = lots.length === 1 ? lots[0] : null;
  const displayPrice = effectivePrice(product);
  const outOfStock = isOutOfStock(product);
  const onSale = isOnSale(product);
  const badges = productBadges(product);
  const productUrl = `/produit/${product.slug || product.id}`;

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (outOfStock) return;
    if (onAddToCart) return onAddToCart();
    if (hasMultipleLots) return router.push(productUrl);
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug || product.id,
      productImage: mainImage,
      categoryName: product.category?.name || "",
      price: product.price,
      stock: product.stock ?? 999,
      ...(singleLot && {
        lotId: singleLot.id,
        lotName: singleLot.name,
        lotPrice: singleLot.price,
        lotStock: singleLot.stock,
      }),
    });
  };

  const isWishlisted = useWishlistStore((state) => state.productIds.includes(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  const cartLabel = outOfStock
    ? "Produit épuisé"
    : hasMultipleLots
      ? `Choisir une option pour ${product.name}`
      : `Ajouter ${product.name} au panier`;

  return (
    <article className="group relative w-full min-w-0">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--som-primary-50)]">
        <MediaLink href={productUrl} onOpen={onOpen}>
          <Image
            src={mainImage}
            alt={product.name}
            fill
            priority={priority}
            className={`object-cover transition-opacity duration-[1200ms] ease-[cubic-bezier(0.33,0,0.2,1)] motion-reduce:transition-none ${
              hoverImage && !outOfStock ? "group-hover:opacity-0" : ""
            } ${outOfStock ? "opacity-55" : ""}`}
            style={{ objectPosition: "center 20%" }}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
          />
          {hoverImage && !outOfStock && (
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
        {showBadge && (badges.length > 0 || outOfStock) && (
          <ul className="pointer-events-none absolute right-2.5 top-2.5 m-0 flex list-none flex-col items-end gap-1.5 p-0 md:right-3 md:top-3">
            {outOfStock ? (
              <li className="bg-white px-2 py-[5px] text-[9px] font-normal uppercase leading-none tracking-[0.12em] text-[#6b6b6b]">
                Épuisé
              </li>
            ) : (
              badges.map((badge) => (
                <li
                  key={badge.text}
                  className={`bg-white px-2 py-[5px] text-[9px] font-normal uppercase leading-none tracking-[0.12em] tabular-nums ${
                    badge.tone === "accent" ? "text-[var(--som-accent-deep)]" : "text-[var(--som-ink)]"
                  }`}
                >
                  {badge.text}
                </li>
              ))
            )}
          </ul>
        )}
        {!outOfStock && (
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
              <Link href={productUrl} className="line-clamp-2 transition-opacity duration-300 hover:opacity-60">
                {product.name}
              </Link>
            )}
          </h3>
          {showWishlist && (
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={isWishlisted}
              aria-label={isWishlisted ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`}
              className={`-my-3 -mr-3 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center transition-[color,transform] duration-300 active:scale-90 ${
                isWishlisted ? "text-[var(--som-accent-deep)]" : "text-[#6b6b6b] hover:text-[var(--som-ink)]"
              }`}
            >
              <Heart size={16} strokeWidth={1.3} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          )}
        </div>
        <p className="m-0 mt-1 flex flex-wrap items-baseline gap-x-2 tabular-nums">
          {onSale && (
            <s className="text-[14px] font-light text-[#8a8a8a] decoration-[#8a8a8a]/80">
              <span className="sr-only">Prix initial : </span>
              {formatPrice(product.oldPrice!)}
            </s>
          )}
          <span
            className={`text-[14px] font-normal ${
              outOfStock ? "text-[#9a9a9a]" : onSale ? "text-[var(--som-accent-deep)]" : "text-[var(--som-ink)]"
            }`}
          >
            {onSale && <span className="sr-only">Prix soldé : </span>}
            {hasMultipleLots ? "Dès " : ""}
            {formatPrice(displayPrice)}
          </span>
        </p>
      </div>
    </article>
  );
}
function MediaLink({ href, onOpen, children }: { href: string; onOpen?: () => void; children: React.ReactNode }) {
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
