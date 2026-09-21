import { Suspense } from "react";
import AnnouncementBar from "@/shared/components/layout/AnnouncementBar";
import { HeaderWrapper } from "@/shared/components/layout/HeaderWrapper";
import { Footer } from "@/shared/components/layout/Footer";
import HeroSection from "@/features/home/components/HeroSection";
import { CollectionsSection } from "@/features/home/components/CollectionsSection";
import { BestSellersSection } from "@/features/home/components/BestSellersSection";
import { FeaturedProductsSection } from "@/features/home/components/FeaturedProductsSection";
import { TestimonialsSection } from "@/features/testimonials/components/TestimonialsSection";
import { WhatsAppButton } from "@/shared/components/ui/WhatsAppButton";
import { getHomePageData } from "@/features/home/server/queries";

// ============================================================
// Loading fallbacks for sections
// ============================================================

function SectionSkeleton({ height = "400px" }: { height?: string }) {
  return (
    <div
      style={{
        height,
        background: "linear-gradient(90deg, #fafafa 25%, #eeeeec 50%, #fafafa 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
  );
}

// ============================================================
// Home Page - Server Component with SSR data fetching
// ============================================================

export default async function HomePage() {
  // Fetch all home page data in parallel (cached)
  const data = await getHomePageData();

  return (
    <>
      <AnnouncementBar />
      <HeaderWrapper />
      <main>
        {/* Hero - Dynamic from DB */}
        <HeroSection data={data.heroBanner} />

        {/* Collections - Categories from DB */}
        <Suspense fallback={<SectionSkeleton height="600px" />}>
          <CollectionsSection categories={data.categories} />
        </Suspense>

        {/* Coups de cœur - 2 rows of 4 new products */}
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <FeaturedProductsSection products={data.newProducts} />
        </Suspense>

        {/* Best Sellers - Products from DB */}
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <BestSellersSection products={data.bestsellers} />
        </Suspense>

        <TestimonialsSection testimonials={data.testimonials} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
