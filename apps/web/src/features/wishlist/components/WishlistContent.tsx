"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useHasMounted } from "@/shared/hooks/useHasMounted";
import { ProductCard } from "@/features/products/components/ProductCard";
import type { ProductSummary } from "@/features/products/types";
import { fetchWishlistProducts } from "../server/actions";
import { useWishlistStore } from "../store";

const SKELETONS = [1, 2, 3, 4, 5, 6];

function EmptyWishlist() {
  return (
    <section className="mx-auto flex max-w-[480px] flex-col items-center px-4 py-20 text-center md:py-28">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--som-primary-50)] text-[var(--som-primary)]">
        <Heart size={26} strokeWidth={1.3} aria-hidden />
      </span>
      <p className="m-0 mt-8 text-[11px] uppercase tracking-[0.3em] text-[var(--som-primary)]">Mes favoris</p>
      <h1 className="m-0 mt-3 text-[26px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:text-[30px]">
        Aucun favori pour le moment
      </h1>
      <p className="m-0 mt-4 text-[15px] font-light leading-relaxed text-[#4a4a4a]">
        Touchez le cœur sur une pièce pour la retrouver ici, et la commander quand vous voulez.
      </p>
      <Link href="/catalogue" className="btn-primary mt-10">
        Découvrir la boutique
      </Link>
    </section>
  );
}

function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4" aria-busy="true">
      {SKELETONS.map((i) => (
        <div key={i}>
          <div className="aspect-[3/4] animate-pulse bg-[var(--som-surface)]" />
          <div className="mt-4 h-3 w-2/3 animate-pulse bg-[var(--som-surface)]" />
          <div className="mt-2 h-3 w-1/3 animate-pulse bg-[var(--som-surface)]" />
        </div>
      ))}
    </div>
  );
}

export function WishlistContent() {
  const hasMounted = useHasMounted();
  const productIds = useWishlistStore((state) => state.productIds);
  const toggle = useWishlistStore((state) => state.toggle);
  const [products, setProducts] = useState<Map<string, ProductSummary> | null>(null);
  const [isPending, startTransition] = useTransition();
  const loadedKey = useRef<string>("");

  const missingKey = useMemo(
    () =>
      productIds
        .filter((id) => !products?.has(id))
        .sort()
        .join(","),
    [productIds, products]
  );

  useEffect(() => {
    if (!hasMounted || !missingKey || loadedKey.current === missingKey) return;
    loadedKey.current = missingKey;
    const ids = missingKey.split(",");
    startTransition(async () => {
      const result = await fetchWishlistProducts(ids);
      setProducts((current) => {
        const next = new Map(current ?? []);
        for (const product of result.products) next.set(product.id, product);
        return next;
      });
      for (const id of result.missingIds) toggle(id);
    });
  }, [hasMounted, missingKey, toggle]);

  if (!hasMounted) return <div className="min-h-[60vh]" />;
  if (productIds.length === 0) return <EmptyWishlist />;

  const visible = productIds
    .map((id) => products?.get(id))
    .filter((product): product is ProductSummary => Boolean(product));
  const loading = (isPending || products === null) && visible.length < productIds.length;

  return (
    <div className="mx-auto max-w-[1180px] px-4 pb-20 pt-10 md:px-8 md:pb-28 md:pt-14">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--som-border)] pb-6">
        <div>
          <p className="m-0 text-[11px] uppercase tracking-[0.3em] text-[var(--som-primary)]">Vos coups de cœur</p>
          <h1 className="m-0 mt-2 text-[26px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:text-[30px]">
            Mes favoris
          </h1>
        </div>
        <p className="m-0 text-[13px] font-light text-[var(--som-gray)]">
          <span className="tabular-nums">{productIds.length}</span> pièce{productIds.length > 1 ? "s" : ""} ·
          enregistrées sur cet appareil
        </p>
      </header>
      <div className="mt-10">
        {loading && visible.length === 0 ? (
          <WishlistSkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-14">
            {visible.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
