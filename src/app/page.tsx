import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import { CollectionsSection } from "@/components/sections/CollectionsSection";
import { BestSellersSection } from "@/components/sections/BestSellersSection";
import NewCollectionSection from "@/components/sections/NewCollectionSection";
import WhyChooseSection from "@/components/sections/WhyChooseSection";
import StorySection from "@/components/sections/StorySection";
import { LookbookSection } from "@/components/sections/LookbookSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { InstagramSection } from "@/components/sections/InstagramSection";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <HeroSection />
        <CollectionsSection />
        <BestSellersSection />
        <NewCollectionSection />
        <WhyChooseSection />
        <LookbookSection />
        <StorySection />
        <TestimonialsSection />
        <InstagramSection />
        <NewsletterSection />
      </main>
      <Footer />
      <CartSidebar />
      <WhatsAppButton />
    </>
  );
}
