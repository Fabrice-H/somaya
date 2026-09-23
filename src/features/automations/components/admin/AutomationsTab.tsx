"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Badge } from "@/shared/components/admin/ui/Badge";
import { formatDateTime, formatRelativeDays } from "@/shared/lib/format";
import { EVENT_LABELS } from "@/features/events/constants";
import type { DomainEventType } from "@/features/events/types";
import { RUN_STATUS_LABELS } from "../../constants";
import { toggleAutomationAction } from "../../server/actions";
import type { AutomationGroup, AutomationsOverview, AutomationView } from "../../types";

const GROUPS: AutomationGroup[] = ["Commandes", "Fidélité", "Clientes", "Notifications"];

function AutomationRow({ automation }: { automation: AutomationView }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(automation.enabled);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setError(null);
    startTransition(async () => {
      const result = await toggleAutomationAction({ key: automation.key, enabled: next });
      if (!result.ok) {
        setEnabled(!next);
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <li className="flex items-start gap-4 border-b border-[var(--som-border)] px-5 py-4 last:border-b-0 lg:px-6">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={automation.label}
        disabled={!automation.available || isPending}
        onClick={toggle}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
          enabled ? "bg-[var(--som-primary)]" : "bg-[var(--som-border-strong)]"
        }`}
      >
        <span
          aria-hidden
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? "left-0.5 translate-x-5" : "left-0.5"}`}
        />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="m-0 text-[14px] font-medium text-[var(--som-ink)]">{automation.label}</p>
          {!automation.available && <Badge tone="neutral">À venir</Badge>}
          {automation.lastStatus && (
            <Badge tone={RUN_STATUS_LABELS[automation.lastStatus].tone}>
              {RUN_STATUS_LABELS[automation.lastStatus].label}
            </Badge>
          )}
        </div>
        <p className="m-0 mt-1 text-[13px] font-light leading-relaxed text-[#4a4a4a]">{automation.description}</p>
        <p className="m-0 mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--som-gray)]">
          {automation.on.length > 0
            ? `Déclencheur : ${automation.on.map((type) => EVENT_LABELS[type as DomainEventType]).join(", ")}`
            : "Déclencheur : chaque jour"}
          {automation.lastRunAt && ` · dernière exécution ${formatRelativeDays(automation.lastRunAt).toLowerCase()}`}
        </p>
        {error && (
          <p role="alert" className="m-0 mt-1 text-[12px] text-[var(--som-error)]">
            {error}
          </p>
        )}
      </div>
    </li>
  );
}

export function AutomationsTab({ overview }: { overview: AutomationsOverview }) {
  return (
    <div className="grid items-start gap-6 xl:grid-cols-[1fr_420px]">
      <div className="space-y-6">
        {GROUPS.map((group) => {
          const items = overview.automations.filter((automation) => automation.group === group);
          if (items.length === 0) return null;
          return (
            <AdminCard key={group} title={group} padded={false}>
              <ul className="m-0 list-none p-0">
                {items.map((automation) => (
                  <AutomationRow key={automation.key} automation={automation} />
                ))}
              </ul>
            </AdminCard>
          );
        })}
        <p className="m-0 text-[12px] font-light leading-relaxed text-[var(--som-gray)]">
          Les notifications automatiques (clientes et équipe) seront activables ici dès qu&apos;un canal d&apos;envoi
          sera configuré.
        </p>
      </div>
      <AdminCard title="Dernières exécutions" padded={false}>
        {overview.runs.length === 0 ? (
          <p className="m-0 px-5 py-8 text-center text-[13px] font-light text-[var(--som-gray)]">
            Aucune exécution pour le moment.
          </p>
        ) : (
          <ul className="m-0 list-none p-0">
            {overview.runs.map((run) => (
              <li key={run.id} className="border-b border-[var(--som-border)] px-5 py-3 last:border-b-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="m-0 truncate text-[13px] font-medium text-[var(--som-ink)]">{run.automation_label}</p>
                  <Badge tone={RUN_STATUS_LABELS[run.status].tone}>{RUN_STATUS_LABELS[run.status].label}</Badge>
                </div>
                <p className="m-0 mt-0.5 text-[12px] font-light text-[var(--som-gray)]">
                  {formatDateTime(run.created_at)} · {EVENT_LABELS[run.event_type as DomainEventType] ?? run.event_type}
                  {run.message && ` · ${run.message}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
