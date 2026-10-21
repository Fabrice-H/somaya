import type { Metadata } from "next";
import { getCategoryOptions } from "@/features/categories/server/queries";
import { LotForm } from "@/features/lots/components/admin/form/LotForm";

export const metadata: Metadata = {
  title: "Nouveau Lot | Admin SO'MAYA",
  description: "Créer un nouveau lot de prix",
};

export default async function NewLotPage() {
  const categories = await getCategoryOptions();
  return <LotForm categories={categories} />;
}
