import type { Metadata } from "next";
import { ConversationsView } from "@/features/whatsapp/components/admin/ConversationsView";
import { getConversations } from "@/features/whatsapp/server/queries";
import { getWhatsappSettings } from "@/features/whatsapp/server/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Conversations WhatsApp | Admin SO'MAYA",
};

export default async function ConversationsPage() {
  const [conversations, settings] = await Promise.all([getConversations(), getWhatsappSettings()]);
  return <ConversationsView conversations={conversations} settings={settings} />;
}
