import { Loader2 } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Table, Td, Th, Tr } from "@/shared/components/admin/ui/Table";
import type { Product } from "@/features/products/types";
import { ProductIdentity } from "./ProductIdentity";
import { ProductPrice } from "./ProductPrice";
import { ProductRowActions } from "./ProductRowActions";
import { StockBadge, VisibilityBadge } from "./StockBadge";

interface ProductsTableProps {
  products: Product[];
  pendingId: string | null;
  onToggleVisibility: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductsTable({ products, pendingId, onToggleVisibility, onDelete }: ProductsTableProps) {
  return (
    <AdminCard padded={false}>
      <div className="hidden md:block">
        <Table>
          <thead>
            <tr>
              <Th>Produit</Th>
              <Th>Prix</Th>
              <Th>Stock</Th>
              <Th>Boutique</Th>
              <Th align="right">
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td>
                  <ProductIdentity product={product} />
                </Td>
                <Td>
                  <ProductPrice price={product.price} oldPrice={product.old_price} />
                </Td>
                <Td>
                  <StockBadge product={product} />
                </Td>
                <Td>
                  <span className="inline-flex items-center gap-2">
                    <VisibilityBadge active={product.is_active} />
                    {pendingId === product.id && (
                      <Loader2 size={14} className="animate-spin text-[var(--som-gray)]" aria-label="Mise à jour…" />
                    )}
                  </span>
                </Td>
                <Td align="right">
                  <ProductRowActions
                    product={product}
                    busy={pendingId === product.id}
                    onToggleVisibility={onToggleVisibility}
                    onDelete={onDelete}
                  />
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </div>

      <ul className="m-0 list-none p-0 md:hidden">
        {products.map((product) => (
          <li key={product.id} className="border-b border-[var(--som-border)] p-4 last:border-b-0">
            <ProductIdentity product={product} />
            <div className="mt-3 flex flex-wrap items-center gap-2 pl-[72px]">
              <ProductPrice price={product.price} oldPrice={product.old_price} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-[72px]">
              <StockBadge product={product} />
              <VisibilityBadge active={product.is_active} />
            </div>
            <div className="mt-3">
              <ProductRowActions
                product={product}
                busy={pendingId === product.id}
                onToggleVisibility={onToggleVisibility}
                onDelete={onDelete}
              />
            </div>
          </li>
        ))}
      </ul>
    </AdminCard>
  );
}
