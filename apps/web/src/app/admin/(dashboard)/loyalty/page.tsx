import type { Metadata } from "next";
import { LoyaltyOverviewView } from "@/features/loyalty/components/admin/LoyaltyOverviewView";
import { getLoyaltyOverview } from "@/features/loyalty/server/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fidélité | Admin SO'MAYA",
};

export default async function LoyaltyPage() {
  const overview = await getLoyaltyOverview();
  return <LoyaltyOverviewView overview={overview} />;
}
