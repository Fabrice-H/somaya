import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryOptions } from "@/features/categories/server/queries";
import { getPriceLot } from "@/features/lots/server/queries";
import { LotForm } from "@/features/lots/components/admin/form/LotForm";

export const metadata: Metadata = {
  title: "Modifier Lot | Admin SO'MAYA",
  description: "Modifier un lot de prix",
};

export default async function EditLotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [lot, categories] = await Promise.all([getPriceLot(id), getCategoryOptions()]);
  if (!lot) notFound();
  return <LotForm lot={lot} categories={categories} />;
}
