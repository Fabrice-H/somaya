"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, Send, User } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import { Badge } from "@/shared/components/admin/ui/Badge";
import { formatDateTime } from "@/shared/lib/format";
import { formatPhone } from "@/shared/lib/phone";
import { CUSTOMERS_PATH } from "@/features/customers/constants";
import {
  CONVERSATION_MODE_LABELS,
  CONVERSATIONS_PATH,
  MESSAGE_MAX_LENGTH,
  MESSAGE_STATUS_LABELS,
} from "../../constants";
import { markConversationReadAction, replyToConversationAction, setConversationModeAction } from "../../server/actions";
import type { ConversationDetail } from "../../types";

const REFRESH_MS = 10_000;

export function ConversationThread({
  conversation,
  configured,
}: {
  conversation: ConversationDetail;
  configured: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [conversation.messages.length]);

  useEffect(() => {
    if (conversation.unread_count > 0) void markConversationReadAction(conversation.id);
  }, [conversation.id, conversation.unread_count]);

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), REFRESH_MS);
    return () => clearInterval(timer);
  }, [router]);

  const send = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await replyToConversationAction({ conversationId: conversation.id, body });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setBody("");
      router.refresh();
    });
  };

  const toggleMode = () =>
    startTransition(async () => {
      await setConversationModeAction({
        conversationId: conversation.id,
        mode: conversation.mode === "auto" ? "human" : "auto",
      });
      router.refresh();
    });

  return (
    <AdminPage
      eyebrow="Conversation"
      title={conversation.display_name}
      description={conversation.phone ? formatPhone(conversation.phone) : `+${conversation.wa_id}`}
      back={{ href: CONVERSATIONS_PATH, label: "Toutes les conversations" }}
      actions={
        <div className="flex flex-wrap items-center gap-3">
          {conversation.customer_id && (
            <Link href={`${CUSTOMERS_PATH}/${conversation.customer_id}`} className="btn-secondary btn-sm">
              Fiche cliente
            </Link>
          )}
          <button
            type="button"
            onClick={toggleMode}
            disabled={isPending}
            className="btn-secondary btn-sm disabled:opacity-60"
          >
            {conversation.mode === "auto" ? "Prendre la main" : "Rendre à l'automatique"}
          </button>
        </div>
      }
    >
      <AdminCard
        padded={false}
        action={
          <Badge tone={CONVERSATION_MODE_LABELS[conversation.mode].tone}>
            {CONVERSATION_MODE_LABELS[conversation.mode].label}
          </Badge>
        }
        title="Fil de discussion"
      >
        <div className="max-h-[60vh] space-y-3 overflow-y-auto bg-[var(--som-surface)] p-5">
          {conversation.messages.map((message) => {
            const outbound = message.direction === "out";
            return (
              <div key={message.id} className={`flex ${outbound ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-3 text-[14px] leading-relaxed ${
                    outbound ? "bg-[var(--som-primary)] text-white" : "bg-white text-[var(--som-ink)]"
                  }`}
                >
                  {message.media_url && message.type === "image" && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={message.media_url} alt="" className="mb-2 max-h-64 w-auto" />
                  )}
                  {message.body ? (
                    <p className="m-0 whitespace-pre-wrap">{message.body}</p>
                  ) : (
                    <p className="m-0 italic opacity-70">({message.type})</p>
                  )}
                  <p
                    className={`m-0 mt-1.5 flex items-center gap-1 text-[10px] ${outbound ? "text-white/70" : "text-[var(--som-gray)]"}`}
                  >
                    {message.author === "assistant" && <Bot size={11} strokeWidth={1.5} aria-hidden />}
                    {message.author === "team" && <User size={11} strokeWidth={1.5} aria-hidden />}
                    {formatDateTime(message.created_at)}
                    {outbound && ` · ${MESSAGE_STATUS_LABELS[message.status] ?? message.status}`}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={send} className="border-t border-[var(--som-border)] p-4">
          {!conversation.within_window && (
            <p className="m-0 mb-3 text-[12px] text-[#8a5a14]">
              Plus de 24 h depuis le dernier message de la cliente : WhatsApp n&apos;accepte que des modèles approuvés
              au-delà. Répondez depuis le téléphone de la boutique si besoin.
            </p>
          )}
          <div className="flex items-end gap-3">
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={MESSAGE_MAX_LENGTH}
              rows={2}
              placeholder={configured ? "Votre réponse…" : "WhatsApp n'est pas configuré"}
              disabled={!configured || isPending}
              aria-label="Réponse"
              className="input-som resize-y"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  if (body.trim()) send(event);
                }
              }}
            />
            <button
              type="submit"
              disabled={!configured || isPending || !body.trim()}
              className="btn-primary h-[52px] px-5 disabled:opacity-50"
            >
              <Send size={16} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
          {error && (
            <p role="alert" className="m-0 mt-2 text-[12px] text-[var(--som-error)]">
              {error}
            </p>
          )}
        </form>
      </AdminCard>
    </AdminPage>
  );
}
