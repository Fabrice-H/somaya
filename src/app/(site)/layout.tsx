import { getStoreContact } from "@/features/settings/server/queries";
import { AnnouncementBar } from "@/shared/components/layout/AnnouncementBar";
import { Footer } from "@/shared/components/layout/Footer";
import { HeaderWrapper } from "@/shared/components/layout/HeaderWrapper";
import { WhatsAppButton } from "@/shared/components/ui/WhatsAppButton";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const contact = await getStoreContact();

  return (
    <>
      <AnnouncementBar />
      <HeaderWrapper />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppButton number={contact.whatsapp} />
    </>
  );
}
