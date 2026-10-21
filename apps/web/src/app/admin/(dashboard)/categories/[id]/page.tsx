import { notFound } from "next/navigation";
import { getCategoryById } from "@/features/categories/server/queries";
import { CategoryForm } from "@/features/categories/components/admin/form/CategoryForm";

export const metadata = {
  title: "Modifier la catégorie | Admin SO'MAYA",
};

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();
  return <CategoryForm category={category} />;
}
