import { getActiveCategories } from "@/features/categories/server/queries";
import { Header } from "./Header";

export async function HeaderWrapper() {
  const categories = await getActiveCategories();
  return <Header categories={categories.map(({ id, name, slug, imageUrl }) => ({ id, name, slug, imageUrl }))} />;
}
