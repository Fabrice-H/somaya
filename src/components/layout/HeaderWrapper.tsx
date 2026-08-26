import { Header } from "./Header";
import { getCategories } from "@/lib/queries/categories";

export async function HeaderWrapper() {
  const categories = await getCategories();

  return (
    <Header
      categories={categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      }))}
    />
  );
}
