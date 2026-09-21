import { Suspense } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import { CollectionsSection } from "@/components/sections/CollectionsSection";
import { BestSellersSection } from "@/components/sections/BestSellersSection";
import { FeaturedProductsSection } from "@/components/sections/FeaturedProductsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { getHomePageData } from "@/lib/queries/home";

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
