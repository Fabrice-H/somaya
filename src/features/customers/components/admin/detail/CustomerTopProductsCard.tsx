import Image from "next/image";
import { Package } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { EmptyState } from "@/shared/components/admin/ui/EmptyState";
import type { CustomerTopProduct } from "../../../types";

export function CustomerTopProductsCard({ products }: { products: CustomerTopProduct[] }) {
  return (
    <AdminCard title="Produits les plus achetés" padded={false}>
      {products.length === 0 ? (
        <EmptyState icon={Package} title="Aucun achat" description="Les produits achetés apparaîtront ici." />
      ) : (
        <ul className="m-0 list-none p-0">
          {products.map((product) => (
            <li
              key={product.product_name}
              className="flex items-center gap-4 border-b border-[var(--som-border)] px-5 py-3 last:border-b-0 lg:px-6"
            >
              <span className="relative h-12 w-10 shrink-0 overflow-hidden bg-[var(--som-surface)]">
                {product.product_image && (
                  <Image src={product.product_image} alt="" fill sizes="40px" className="object-cover" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-[14px] font-medium text-[var(--som-ink)]">{product.product_name}</p>
                <p className="m-0 mt-0.5 text-[12px] font-light text-[var(--som-gray)]">
                  {product.orders_count} commande{product.orders_count > 1 ? "s" : ""}
                </p>
              </div>
              <span className="text-[13px] tabular-nums text-[var(--som-ink)]">× {product.quantity}</span>
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  );
}
