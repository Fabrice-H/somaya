import type { ReactNode } from "react";
import { getStoreContact } from "@/features/settings/server/queries";
import { WhatsAppButton } from "@/shared/components/ui/WhatsAppButton";
import { AnnouncementBar } from "./AnnouncementBar";
import { Footer } from "./Footer";
import { HeaderWrapper } from "./HeaderWrapper";

export async function SiteShell({ children }: { children: ReactNode }) {
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
