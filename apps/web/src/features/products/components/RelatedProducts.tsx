import { ProductCard } from "./ProductCard";
import type { ProductSummary } from "../types";

export function RelatedProducts({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) return null;
  return (
    <section aria-labelledby="related-title" className="mx-auto max-w-[1240px] px-4 pb-20 md:px-8 md:pb-28">
      <h2
        id="related-title"
        className="m-0 mb-8 text-center text-[20px] font-semibold uppercase tracking-[0.06em] text-[var(--som-ink)] md:mb-10 md:text-[26px]"
      >
        Vous aimerez aussi
      </h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
