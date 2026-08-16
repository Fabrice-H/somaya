import { Suspense } from "react";
import { getInstagramPosts, getInstagramSettings } from "@/features/admin/instagram/actions";
import { InstagramManager } from "@/features/admin/instagram/InstagramManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Instagram | Admin SO'MAYA",
};

async function InstagramData() {
  const [posts, settings] = await Promise.all([
    getInstagramPosts(),
    getInstagramSettings(),
  ]);
  return <InstagramManager initialData={posts} settings={settings} />;
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
          <div className="w-10 h-10 bg-gradient-to-br from-[#833AB4]/30 via-[#FD1D1D]/30 to-[#F77737]/30 rounded-lg animate-pulse" />
          <div>
            <div className="h-6 w-28 bg-[#e8e0d8] rounded animate-pulse mb-2" />
            <div className="h-4 w-72 bg-[#e8e0d8] rounded animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-28 bg-[#e8e0d8] rounded-lg animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div style={{ padding: "32px 40px" }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" style={{ maxWidth: 1200 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-square bg-[#e8e0d8] rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function InstagramPage() {
  return (
    <Suspense fallback={<ManagerSkeleton />}>
      <InstagramData />
    </Suspense>
  );
}
