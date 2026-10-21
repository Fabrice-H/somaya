import type { Metadata } from "next";
import { getPriceLots } from "@/features/lots/server/queries";
import { LotsPageContent } from "@/features/lots/components/admin/list/LotsPageContent";

export const metadata: Metadata = {
  title: "Lots de Prix | Admin SO'MAYA",
  description: "Gérer les lots de prix et leurs articles",
};

export default async function AdminLotsPage() {
  const lots = await getPriceLots();
  return <LotsPageContent initialLots={lots} />;
}
