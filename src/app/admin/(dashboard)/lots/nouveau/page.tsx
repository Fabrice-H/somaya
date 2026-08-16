import { Metadata } from "next";
import { getCategories } from "@/features/admin/lots/actions";
import { LotForm } from "@/features/admin/lots/components/LotForm";

export const metadata: Metadata = {
  title: "Nouveau Lot | Admin SO'MAYA",
  description: "Créer un nouveau lot de prix",
};

export default async function NewLotPage() {
  const categories = await getCategories();

  return <LotForm categories={categories} />;
}
