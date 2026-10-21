import { BestSellersSection } from "@/features/home/components/BestSellersSection";
import { CollectionsSection } from "@/features/home/components/CollectionsSection";
import { FeaturedProductsSection } from "@/features/home/components/FeaturedProductsSection";
import { HeroSection } from "@/features/home/components/HeroSection";
import { getHomePageData } from "@/features/home/server/queries";
import { TestimonialsSection } from "@/features/testimonials/components/TestimonialsSection";

export default async function HomePage() {
  const { heroBanner, categories, newArrivals, bestsellers, testimonials } = await getHomePageData();

  return (
    <>
      <HeroSection data={heroBanner} />
      <CollectionsSection categories={categories} />
      <FeaturedProductsSection products={newArrivals} />
      <BestSellersSection products={bestsellers} />
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}
