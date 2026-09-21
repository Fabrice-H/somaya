import { Suspense } from "react";
import { getCategories } from "@/features/categories/server/queries";
import { CategoriesClient } from "@/features/categories/components/admin/list/CategoriesClient";
import { CategoriesPageHeader } from "@/features/categories/components/admin/list/CategoriesPageHeader";
import { CategoriesSkeleton } from "@/features/categories/components/admin/list/CategoriesSkeleton";

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
    <div style={{ padding: "32px 40px" }}>
      <CategoriesPageHeader />
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesData />
      </Suspense>
    </div>
  );
}
