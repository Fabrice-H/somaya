import { Suspense } from "react";
import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import { getCategories } from "@/features/categories/server/queries";
import { CategoriesClient } from "@/features/categories/components/admin/list/CategoriesClient";
import { CategoriesSkeleton } from "@/features/categories/components/admin/list/CategoriesSkeleton";
import { NewCategoryLink } from "@/features/categories/components/admin/list/NewCategoryLink";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catégories | Admin SO'MAYA",
};

async function CategoriesData() {
  const categories = await getCategories();
  return <CategoriesClient categories={categories} />;
}

export default function AdminCategoriesPage() {
  return (
    <AdminPage
      eyebrow="Catalogue"
      title="Catégories"
      description="Organisez les univers de votre boutique."
      actions={<NewCategoryLink />}
    >
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesData />
      </Suspense>
    </AdminPage>
  );
}
