import Link from "next/link";
import { ProductCard } from "@/features/products/components/ProductCard";
import type { ProductSummary } from "@/features/products/types";

interface FeaturedProductsSectionProps {
  products: ProductSummary[];
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section id="nouveautes" className="bg-white px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-[1240px]">
        {/* Header - same treatment as the categories section */}
        <div className="mb-10 text-center md:mb-12">
          <h2
            className="m-0 text-[26px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:text-[36px]"
            style={{ lineHeight: 1.2 }}
          >
            Nos coups de cœur
          </h2>
          <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.3em] text-[var(--som-gray)] md:text-[15px]">
            Sélection du moment
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-16">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>

        <div className="mt-10 text-center md:mt-12">
          <Link
            href="/catalogue"
            className="inline-flex min-h-11 items-center justify-center border border-[var(--som-primary)] px-10 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--som-primary)] transition-colors duration-200 hover:bg-[var(--som-primary)] hover:text-white"
          >
            Voir la sélection
          </Link>
        </div>
      </div>
    </section>
  );
}
