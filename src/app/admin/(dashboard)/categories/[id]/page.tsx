import { notFound } from 'next/navigation';
import { CategoryForm } from '@/features/admin/categories/CategoryForm';
import { getCategoryById } from '@/features/admin/categories/actions';

export const metadata = {
  title: 'Modifier la catégorie | Admin SO\'MAYA',
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return <CategoryForm category={category} />;
}
