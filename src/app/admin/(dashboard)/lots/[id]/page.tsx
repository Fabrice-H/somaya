import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPriceLot, getCategories } from "@/features/admin/lots/actions";
import { LotForm } from "@/features/admin/lots/components/LotForm";

export const metadata: Metadata = {
  title: "Modifier Lot | Admin SO'MAYA",
  description: "Modifier un lot de prix",
};

interface EditLotPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLotPage({ params }: EditLotPageProps) {
  const { id } = await params;
  const [lot, categories] = await Promise.all([
    getPriceLot(id),
    getCategories(),
  ]);

  if (!lot) {
    notFound();
  }

  return <LotForm lot={lot} categories={categories} />;
}
