import { Badge } from "@/shared/components/admin/ui/Badge";
import { isLowStock } from "@/features/products/utils";
import type { Product } from "@/features/products/types";

export function StockBadge({ product }: { product: Pick<Product, "stock" | "low_stock_threshold"> }) {
  if (product.stock <= 0) return <Badge tone="danger">Épuisé</Badge>;
  if (isLowStock(product)) return <Badge tone="warning">Stock faible · {product.stock}</Badge>;
  return <Badge tone="success">En stock · {product.stock}</Badge>;
}

export function VisibilityBadge({ active }: { active: boolean }) {
  return active ? <Badge tone="success">En ligne</Badge> : <Badge>Masqué</Badge>;
}
