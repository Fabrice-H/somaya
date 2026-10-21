"use client";

import Link from "next/link";
import { Check, Heart } from "lucide-react";
import { useWishlistStore } from "@/features/wishlist/store";
import { RichTextViewer } from "@/shared/components/rich-text/RichTextViewer";
import { QuantityStepper } from "@/shared/components/ui/QuantityStepper";
import { formatPrice } from "@/shared/lib/format";
import type { ProductWithCategoryAndLots } from "@/shared/lib/db/schema";
import { useProductPurchase } from "../../hooks/useProductPurchase";
import { discountPercent } from "../../utils";
import { LotPicker } from "./LotPicker";
import { OptionPicker } from "./OptionPicker";
import { ProductGallery } from "./ProductGallery";
import { ProductReassurance } from "./ProductReassurance";

function productBadge(product: ProductWithCategoryAndLots, discount: number) {
  if (discount > 0) return `−${discount} %`;
  if (product.isNew) return "Nouveau";
  if (product.isBestseller) return "Best-seller";
  if (product.isFeatured) return "Must-have";
  return null;
}

export function ProductDetail({ product }: { product: ProductWithCategoryAndLots }) {
  const purchase = useProductPurchase(product);
  const isWishlisted = useWishlistStore((state) => state.productIds.includes(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  const oldPrice = product.oldPrice ? Number(product.oldPrice) : null;
  const discount = purchase.selectedItem ? 0 : discountPercent(purchase.unitPrice, oldPrice);
  const badge = productBadge(product, discount);
  const images = purchase.selectedItem
    ? [purchase.selectedItem.itemImage]
    : product.images?.length
      ? product.images
      : purchase.lotOptions.flatMap((lot) => lot.items.map((item) => item.image)).slice(0, 6);
  const details = [
    product.material && `Matière : ${product.material}`,
    product.category && `Catégorie : ${product.category.name}`,
    product.sku && `Référence : ${product.sku}`,
  ].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-20 pt-6 md:px-8 md:pb-28 md:pt-8">
      <nav
        aria-label="Fil d'Ariane"
        className="mb-6 text-[11px] uppercase tracking-[0.2em] text-[var(--som-gray)] md:mb-8"
      >
        <Link href="/" className="hover:text-[var(--som-primary)]">
          Accueil
        </Link>
        <span aria-hidden className="mx-2">
          /
        </span>
        {product.category ? (
          <Link href={`/catalogue/${product.category.slug}`} className="hover:text-[var(--som-primary)]">
            {product.category.name}
          </Link>
        ) : (
          <Link href="/catalogue" className="hover:text-[var(--som-primary)]">
            Boutique
          </Link>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <ProductGallery images={images} alt={product.name} soldOut={purchase.isSoldOut} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          {badge && (
            <span
              className={`inline-block px-2.5 py-1.5 text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-white ${
                discount > 0 ? "bg-[var(--som-accent-deep)]" : "bg-[var(--som-ink)]"
              }`}
            >
              {badge}
            </span>
          )}
          <h1 className="m-0 mt-4 text-[28px] font-semibold leading-tight text-[var(--som-ink)] md:text-[38px]">
            {product.name}
          </h1>

          <p className="m-0 mt-3 flex flex-wrap items-baseline gap-x-3 tabular-nums">
            {discount > 0 && oldPrice && (
              <s className="text-[17px] font-light text-[#8a8a8a]">
                <span className="sr-only">Prix initial : </span>
                {formatPrice(oldPrice)}
              </s>
            )}
            <span
              className={`text-[24px] font-normal ${discount > 0 ? "text-[var(--som-accent-deep)]" : "text-[var(--som-ink)]"}`}
            >
              {formatPrice(purchase.unitPrice)}
            </span>
          </p>

          {product.description && (
            <RichTextViewer
              content={product.description}
              className="mt-5 text-[15px] font-light leading-relaxed text-[#4a4a4a]"
            />
          )}

          <div className="mt-8 flex flex-col gap-7">
            {purchase.hasLots ? (
              <LotPicker lots={purchase.lotOptions} selected={purchase.selectedItem} onSelect={purchase.selectItem} />
            ) : (
              <>
                {purchase.colors.length > 0 && (
                  <OptionPicker
                    label="Couleur"
                    options={purchase.colors}
                    value={purchase.color}
                    onChange={purchase.setColor}
                  />
                )}
                {purchase.sizes.length > 0 && (
                  <OptionPicker
                    label="Taille"
                    options={purchase.sizes}
                    value={purchase.size}
                    onChange={purchase.setSize}
                    compact
                  />
                )}
              </>
            )}
          </div>

          {purchase.maxStock > 0 && purchase.maxStock <= 3 && (
            <p className="m-0 mt-6 text-[13px] text-[var(--som-accent-deep)]">Plus que {purchase.maxStock} en stock</p>
          )}

          <div className="mt-6 flex gap-3">
            <QuantityStepper value={purchase.quantity} onChange={purchase.changeQuantity} />
            <button
              type="button"
              onClick={purchase.addToCart}
              disabled={purchase.isSoldOut}
              className="btn-primary h-14 flex-1 px-4"
            >
              {purchase.isSoldOut ? (
                "Épuisé"
              ) : purchase.added ? (
                <>
                  <Check size={16} strokeWidth={1.8} aria-hidden />
                  Ajouté au panier
                </>
              ) : (
                "Ajouter au panier"
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-pressed={isWishlisted}
            className="mt-3 flex h-14 w-full cursor-pointer items-center justify-center gap-2.5 border border-[var(--som-border-strong)] text-[12px] uppercase tracking-[0.18em] text-[var(--som-ink)] transition-colors hover:border-[var(--som-ink)]"
          >
            <Heart
              size={16}
              strokeWidth={1.4}
              aria-hidden
              fill={isWishlisted ? "currentColor" : "none"}
              className={isWishlisted ? "text-[var(--som-accent)]" : ""}
            />
            {isWishlisted ? "Dans vos favoris" : "Ajouter aux favoris"}
          </button>

          {purchase.error && (
            <p role="alert" className="m-0 mt-3 text-[13px] text-[var(--som-error)]">
              {purchase.error}
            </p>
          )}

          {details.length > 0 && (
            <ul className="m-0 mt-10 flex list-none flex-col gap-2.5 border-t border-[var(--som-border)] p-0 pt-8">
              {details.map((detail) => (
                <li key={detail} className="flex items-center gap-3 text-[14px] font-light text-[#4a4a4a]">
                  <span aria-hidden className="h-px w-3 bg-[var(--som-primary)]" />
                  {detail}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 border-t border-[var(--som-border)] pt-6">
            <ProductReassurance />
          </div>
        </div>
      </div>
    </div>
  );
}
