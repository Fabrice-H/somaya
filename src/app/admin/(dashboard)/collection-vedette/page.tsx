import { Suspense } from "react";
import { getFeaturedCollection } from "@/features/admin/featured-collection/actions";
import { FeaturedCollectionForm } from "@/features/admin/featured-collection/FeaturedCollectionForm";
import { getCategories } from "@/features/admin/categories/actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Collection Vedette | Admin SO'MAYA",
};

async function FeaturedCollectionData() {
  const [data, categories] = await Promise.all([
    getFeaturedCollection(),
    getCategories(),
  ]);

  const simplifiedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return (
    <FeaturedCollectionForm data={data} categories={simplifiedCategories} />
  );
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
                height: 300,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedCollectionPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <FeaturedCollectionData />
    </Suspense>
  );
}
