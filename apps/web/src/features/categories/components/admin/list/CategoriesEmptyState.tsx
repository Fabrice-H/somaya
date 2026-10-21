import { FolderOpen } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { EmptyState } from "@/shared/components/admin/ui/EmptyState";
import { NewCategoryLink } from "./NewCategoryLink";

export function CategoriesEmptyState() {
  return (
    <AdminCard padded={false}>
      <EmptyState
        icon={FolderOpen}
        title="Aucune catégorie"
        description="Créez votre première catégorie pour organiser vos produits."
        action={<NewCategoryLink className="btn-secondary btn-sm" />}
      />
    </AdminCard>
  );
}
