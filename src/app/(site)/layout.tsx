import AnnouncementBar from "@/shared/components/layout/AnnouncementBar";
import { Footer } from "@/shared/components/layout/Footer";
import { HeaderWrapper } from "@/shared/components/layout/HeaderWrapper";
import { WhatsAppButton } from "@/shared/components/ui/WhatsAppButton";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <HeaderWrapper />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
