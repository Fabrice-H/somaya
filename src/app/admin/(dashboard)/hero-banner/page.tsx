import { Suspense } from "react";
import { getHeroBanner } from "@/features/home/server/queries";
import { HeroBannerForm } from "@/features/home/components/admin/HeroBannerForm";
import { HeroBannerSkeleton } from "@/features/home/components/admin/hero-banner/HeroBannerSkeleton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hero Banner | Admin SO'MAYA",
};

async function HeroBannerContent() {
  const data = await getHeroBanner();
  return <HeroBannerForm data={data} />;
}

export default function HeroBannerPage() {
  return (
    <Suspense fallback={<HeroBannerSkeleton />}>
      <HeroBannerContent />
    </Suspense>
  );
}
