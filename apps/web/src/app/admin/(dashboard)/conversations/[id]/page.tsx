import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConversationThread } from "@/features/whatsapp/components/admin/ConversationThread";
import { getConversation } from "@/features/whatsapp/server/queries";
import { getWhatsappSettings } from "@/features/whatsapp/server/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Conversation | Admin SO'MAYA",
};

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [conversation, settings] = await Promise.all([getConversation(id), getWhatsappSettings()]);
  if (!conversation) notFound();
  return <ConversationThread conversation={conversation} configured={settings.configured} />;
}
