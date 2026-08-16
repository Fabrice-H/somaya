import { Suspense } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import { CollectionsSection } from "@/components/sections/CollectionsSection";
import { BestSellersSection } from "@/components/sections/BestSellersSection";
import NewCollectionSection from "@/components/sections/NewCollectionSection";
import { CategoryProductsSection } from "@/components/sections/CategoryProductsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { InstagramSection } from "@/components/sections/InstagramSection";
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
        background: "linear-gradient(90deg, #f5f0eb 25%, #ece5de 50%, #f5f0eb 75%)",
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

        {/* Best Sellers - Products from DB */}
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <BestSellersSection products={data.bestsellers} />
        </Suspense>

        {/* Featured Collection - From DB */}
        <NewCollectionSection data={data.featuredCollection} />

        {/* Hommes Products */}
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <CategoryProductsSection
            products={data.hommesProducts}
            eyebrow="Pour lui"
            title="Collection Hommes"
            description="Des pièces élégantes et raffinées pour l'homme moderne."
            categorySlug="hommes"
          />
        </Suspense>

        {/* Femmes Products */}
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <CategoryProductsSection
            products={data.femmesProducts}
            eyebrow="Pour elle"
            title="Femmes & Accessoires"
            description="L'élégance au féminin, des créations uniques et intemporelles."
            categorySlug="femmes"
          />
        </Suspense>

        <TestimonialsSection testimonials={data.testimonials} />
        <InstagramSection data={data.instagram} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
