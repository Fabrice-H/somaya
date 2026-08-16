import { Suspense } from "react";
import { getHeroBanner } from "@/features/admin/hero-banner/actions";
import { HeroBannerForm } from "@/features/admin/hero-banner/HeroBannerForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hero Banner | Admin SO'MAYA",
};

async function HeroBannerData() {
  const data = await getHeroBanner();
  return <HeroBannerForm data={data} />;
}

function FormSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div
        className="flex items-center justify-between gap-4 bg-[#faf6f1] border-b border-[#511F29]/10"
        style={{ padding: "24px 40px" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e8e0d8] animate-pulse" />
          <div>
            <div className="h-6 w-40 bg-[#e8e0d8] animate-pulse mb-2" />
            <div className="h-4 w-64 bg-[#e8e0d8] animate-pulse" />
          </div>
        </div>
        <div className="h-11 w-32 bg-[#e8e0d8] animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div style={{ padding: "32px 40px" }}>
        <div className="grid lg:grid-cols-2 gap-8" style={{ maxWidth: 1200 }}>
          <div className="space-y-6">
            <div
              className="bg-white animate-pulse"
              style={{
                border: "1px solid rgba(81, 31, 41, 0.1)",
                padding: 24,
                height: 200,
              }}
            />
            <div
              className="bg-white animate-pulse"
              style={{
                border: "1px solid rgba(81, 31, 41, 0.1)",
                padding: 24,
                height: 400,
              }}
            />
          </div>
          <div>
            <div
              className="bg-white animate-pulse"
              style={{
                border: "1px solid rgba(81, 31, 41, 0.1)",
                padding: 24,
                height: 500,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroBannerPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <HeroBannerData />
    </Suspense>
  );
}
