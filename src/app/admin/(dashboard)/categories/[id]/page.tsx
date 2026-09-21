import { notFound } from 'next/navigation';
import { CategoryForm } from '@/features/categories/components/admin/CategoryForm';
import { getCategoryById } from '@/features/categories/server/actions';

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
