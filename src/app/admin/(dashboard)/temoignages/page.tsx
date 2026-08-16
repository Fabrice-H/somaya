import { Suspense } from "react";
import { getTestimonials } from "@/features/admin/testimonials/actions";
import { TestimonialsManager } from "@/features/admin/testimonials/TestimonialsManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Témoignages | Admin SO'MAYA",
};

async function TestimonialsData() {
  const data = await getTestimonials();
  return <TestimonialsManager initialData={data} />;
}

function ManagerSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div
        className="flex items-center justify-between gap-4 bg-[#faf6f1] border-b border-[#511F29]/10"
        style={{ padding: "24px 40px" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e8e0d8] rounded-lg animate-pulse" />
          <div>
            <div className="h-6 w-32 bg-[#e8e0d8] rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-[#e8e0d8] rounded animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-28 bg-[#e8e0d8] rounded-lg animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div style={{ padding: "32px 40px" }}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ maxWidth: 1200 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg animate-pulse"
              style={{
                border: "1px solid rgba(81, 31, 41, 0.1)",
                padding: 16,
                height: 180,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <Suspense fallback={<ManagerSkeleton />}>
      <TestimonialsData />
    </Suspense>
  );
}
