import { getAboutCollections } from "@/features/admin/about-collections/actions";
import { AboutCollectionsClient } from "./AboutCollectionsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Collections À propos | Admin SO'MAYA",
};

export default async function AboutCollectionsPage() {
  const collections = await getAboutCollections();

  return <AboutCollectionsClient initialCollections={collections} />;
}
