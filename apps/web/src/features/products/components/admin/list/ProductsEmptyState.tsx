import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { EmptyState } from "@/shared/components/admin/ui/EmptyState";
import { ADMIN_PRODUCTS_PATH } from "@/features/products/constants";

export function ProductsEmptyState({ filtered }: { filtered: boolean }) {
  return (
    <AdminCard padded={false}>
      {filtered ? (
        <EmptyState
          icon={Package}
          title="Aucun produit ne correspond"
          description="Essayez un autre mot ou une autre catégorie."
        />
      ) : (
        <EmptyState
          icon={Package}
          title="Aucun produit pour le moment"
          description="Ajoutez votre première pièce : quelques photos, un nom et un prix suffisent."
          action={
            <Link href={`${ADMIN_PRODUCTS_PATH}/nouveau`} className="btn-primary btn-sm">
              <Plus size={16} strokeWidth={1.5} aria-hidden />
              Ajouter un produit
            </Link>
          }
        />
      )}
    </AdminCard>
  );
}
