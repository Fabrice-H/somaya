import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import { Badge } from "@/shared/components/admin/ui/Badge";
import { EmptyState } from "@/shared/components/admin/ui/EmptyState";
import { formatRelativeDays } from "@/shared/lib/format";
import { CONVERSATION_MODE_LABELS, CONVERSATIONS_PATH } from "../../constants";
import type { ConversationSummary, WhatsappSettingsData } from "../../types";
import { WhatsappSettingsForm } from "./WhatsappSettingsForm";

export function ConversationsView({
  conversations,
  settings,
}: {
  conversations: ConversationSummary[];
  settings: WhatsappSettingsData;
}) {
  return (
    <AdminPage
      eyebrow="Ventes"
      title="Conversations WhatsApp"
      description="Messages reçus sur le numéro de la boutique, réponses automatiques et prise en main."
    >
      {!settings.configured && (
        <p className="m-0 mb-6 border border-[#e6c28b] bg-[#fbf1e3] px-4 py-3 text-[13px] leading-relaxed text-[#8a5a14]">
          WhatsApp n&apos;est pas encore connecté : ajoutez les variables Meta (numéro, jeton, secret) dans Vercel pour
          recevoir et envoyer des messages.
        </p>
      )}
      <div className="grid items-start gap-6 xl:grid-cols-[1fr_380px]">
        <AdminCard title="Conversations" padded={false}>
          {conversations.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title="Aucune conversation"
              description="Les messages reçus sur WhatsApp apparaîtront ici."
            />
          ) : (
            <ul className="m-0 list-none p-0">
              {conversations.map((conversation) => (
                <li key={conversation.id} className="border-b border-[var(--som-border)] last:border-b-0">
                  <Link
                    href={`${CONVERSATIONS_PATH}/${conversation.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--som-surface-alt)] lg:px-6"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--som-primary-50)] text-[14px] font-medium text-[var(--som-primary)]">
                      {conversation.display_name[0]?.toUpperCase() ?? "?"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`m-0 truncate text-[14px] ${conversation.unread_count > 0 ? "font-semibold" : "font-medium"} text-[var(--som-ink)]`}
                        >
                          {conversation.display_name}
                        </p>
                        {conversation.unread_count > 0 && (
                          <span className="rounded-full bg-[var(--som-accent)] px-1.5 text-[10px] font-semibold tabular-nums text-white">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="m-0 mt-0.5 truncate text-[13px] font-light text-[var(--som-gray)]">
                        {conversation.last_message ?? "(média)"}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-[11px] text-[var(--som-gray)]">
                        {conversation.last_message_at ? formatRelativeDays(conversation.last_message_at) : ""}
                      </span>
                      <Badge tone={CONVERSATION_MODE_LABELS[conversation.mode].tone}>
                        {CONVERSATION_MODE_LABELS[conversation.mode].label}
                      </Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
        <WhatsappSettingsForm settings={settings} />
      </div>
    </AdminPage>
  );
}
