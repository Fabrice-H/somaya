"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Field } from "@/shared/components/admin/ui/Field";
import { updateWhatsappSettingsAction } from "../../server/actions";
import type { WhatsappSettingsData } from "../../types";

export function WhatsappSettingsForm({ settings }: { settings: WhatsappSettingsData }) {
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await updateWhatsappSettingsAction({
        autoReplyEnabled: form.autoReplyEnabled,
        hoursStart: form.hoursStart,
        hoursEnd: form.hoursEnd,
        welcomeMessage: form.welcomeMessage,
        awayMessage: form.awayMessage,
      });
      setMessage(
        result.ok ? { tone: "ok", text: result.message ?? "Enregistré" } : { tone: "error", text: result.error }
      );
      if (result.ok) router.refresh();
    });
  };

  return (
    <form onSubmit={submit}>
      <AdminCard
        title="Réponses automatiques"
        description="Quand personne n'est disponible, la boutique répond quand même."
      >
        <div className="space-y-5">
          <label className="flex cursor-pointer items-center gap-3 text-[14px] text-[var(--som-ink)]">
            <input
              type="checkbox"
              checked={form.autoReplyEnabled}
              onChange={(event) => setForm((current) => ({ ...current, autoReplyEnabled: event.target.checked }))}
              className="h-4 w-4 accent-[var(--som-primary)]"
            />
            Répondre automatiquement au premier message
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Field id="wa_hours_start" label="Ouverture (h)" hint="Heure d'Abidjan">
              <input
                id="wa_hours_start"
                type="number"
                min={0}
                max={23}
                value={form.hoursStart}
                onChange={(event) => setForm((current) => ({ ...current, hoursStart: Number(event.target.value) }))}
                className="input-som"
              />
            </Field>
            <Field id="wa_hours_end" label="Fermeture (h)">
              <input
                id="wa_hours_end"
                type="number"
                min={0}
                max={23}
                value={form.hoursEnd}
                onChange={(event) => setForm((current) => ({ ...current, hoursEnd: Number(event.target.value) }))}
                className="input-som"
              />
            </Field>
          </div>
          <Field id="wa_welcome" label="Message d'accueil (pendant les horaires)">
            <textarea
              id="wa_welcome"
              rows={3}
              maxLength={1000}
              value={form.welcomeMessage}
              onChange={(event) => setForm((current) => ({ ...current, welcomeMessage: event.target.value }))}
              className="input-som resize-y"
            />
          </Field>
          <Field id="wa_away" label="Message d'absence (hors horaires)">
            <textarea
              id="wa_away"
              rows={3}
              maxLength={1000}
              value={form.awayMessage}
              onChange={(event) => setForm((current) => ({ ...current, awayMessage: event.target.value }))}
              className="input-som resize-y"
            />
          </Field>
          <div className="flex items-center justify-between gap-3 border-t border-[var(--som-border)] pt-4">
            <p
              role="status"
              className={`m-0 text-[12px] ${message?.tone === "error" ? "text-[var(--som-error)]" : "text-[var(--som-success)]"}`}
            >
              {message?.text ?? ""}
            </p>
            <button type="submit" disabled={isPending} className="btn-primary btn-sm disabled:opacity-50">
              {isPending ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      </AdminCard>
    </form>
  );
}
