import { Metadata } from "next";
import { getCategories } from "@/features/lots/server/actions";
import { LotForm } from "@/features/lots/components/admin/LotForm";

export const metadata: Metadata = {
  title: "Nouveau Lot | Admin SO'MAYA",
  description: "Créer un nouveau lot de prix",
};

export default async function NewLotPage() {
  const categories = await getCategories();

  return <LotForm categories={categories} />;
}
