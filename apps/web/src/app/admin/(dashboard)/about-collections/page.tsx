import { getAboutCollections } from "@/features/brand/server/queries";
import { AboutCollectionsClient } from "@/features/brand/components/admin/AboutCollectionsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Collections À propos | Admin SO'MAYA",
};

export default async function AboutCollectionsPage() {
  const collections = await getAboutCollections();
  return <AboutCollectionsClient initialCollections={collections} />;
}
