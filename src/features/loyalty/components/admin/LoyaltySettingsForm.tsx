"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { Field } from "@/shared/components/admin/ui/Field";
import { LOYALTY_LEVEL_BADGES } from "../../constants";
import { orderedLevels } from "../../rules";
import { updateLoyaltySettings } from "../../server/actions";
import type { LoyaltySettingsData } from "../../types";

type NumberKey = "pointsPerStep" | "amountStep";
type RuleKey = keyof LoyaltySettingsData["segmentRules"];

const SEGMENT_FIELDS: { key: RuleKey; label: string; hint: string }[] = [
  { key: "newDays", label: "Nouveau (jours)", hint: "Première commande il y a moins de N jours" },
  { key: "activeDays", label: "Actif (jours)", hint: "Dernière commande il y a moins de N jours" },
  { key: "loyalOrders", label: "Fidèle (commandes)", hint: "Au moins N commandes" },
  { key: "vipSpent", label: "VIP (FCFA dépensés)", hint: "Total des commandes livrées" },
  { key: "vipOrders", label: "VIP (commandes)", hint: "Ou au moins N commandes" },
  { key: "inactiveDays", label: "Inactif (jours)", hint: "Aucune commande depuis N jours" },
];

const toInt = (value: string) => (value === "" ? 0 : Number.parseInt(value, 10) || 0);

export function LoyaltySettingsForm({ settings }: { settings: LoyaltySettingsData }) {
  const router = useRouter();
  const [form, setForm] = useState<LoyaltySettingsData>({ ...settings, levels: orderedLevels(settings.levels) });
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const setNumber = (key: NumberKey, value: string) => setForm((current) => ({ ...current, [key]: toInt(value) }));
  const setRule = (key: RuleKey, value: string) =>
    setForm((current) => ({ ...current, segmentRules: { ...current.segmentRules, [key]: toInt(value) } }));
  const setLevel = (index: number, patch: { label?: string; minPoints?: number }) =>
    setForm((current) => ({
      ...current,
      levels: current.levels.map((level, i) => (i === index ? { ...level, ...patch } : level)),
    }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await updateLoyaltySettings(form);
      if (!result.ok) {
        setMessage({ tone: "error", text: result.error });
        return;
      }
      setMessage({ tone: "ok", text: result.message ?? "Enregistré" });
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit}>
      <AdminCard
        title="Règles du programme"
        description="Modifiable à tout moment ; les niveaux sont recalculés à l'enregistrement."
        action={
          <button type="submit" disabled={isPending} className="btn-primary btn-sm disabled:opacity-50">
            {isPending ? "Enregistrement…" : "Enregistrer"}
          </button>
        }
      >
        <div className="space-y-6">
          <label className="flex cursor-pointer items-center gap-3 text-[14px] text-[var(--som-ink)]">
            <input
              type="checkbox"
              checked={form.isEnabled}
              onChange={(event) => setForm((current) => ({ ...current, isEnabled: event.target.checked }))}
              className="h-4 w-4 accent-[var(--som-primary)]"
            />
            Programme actif
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="loyalty_points" label="Points gagnés" hint="Par tranche du montant ci-contre.">
              <input
                id="loyalty_points"
                type="number"
                min={1}
                max={1000}
                value={form.pointsPerStep}
                onChange={(event) => setNumber("pointsPerStep", event.target.value)}
                className="input-som"
              />
            </Field>
            <Field id="loyalty_step" label="Tranche (FCFA)" hint="Calculé sur le sous-total livré.">
              <input
                id="loyalty_step"
                type="number"
                min={100}
                step={100}
                value={form.amountStep}
                onChange={(event) => setNumber("amountStep", event.target.value)}
                className="input-som"
              />
            </Field>
          </div>

          <div>
            <p className="m-0 mb-3 text-[11px] uppercase tracking-[0.18em] text-[var(--som-gray)]">Niveaux</p>
            <div className="space-y-3">
              {form.levels.map((level, index) => (
                <div key={level.key} className="grid grid-cols-[1fr_120px] gap-3">
                  <div>
                    <label htmlFor={`level_label_${level.key}`} className="sr-only">
                      Nom du niveau {LOYALTY_LEVEL_BADGES[level.key].label}
                    </label>
                    <input
                      id={`level_label_${level.key}`}
                      type="text"
                      maxLength={40}
                      value={level.label}
                      onChange={(event) => setLevel(index, { label: event.target.value })}
                      className="input-som"
                    />
                  </div>
                  <div>
                    <label htmlFor={`level_min_${level.key}`} className="sr-only">
                      Points minimum pour {level.label}
                    </label>
                    <input
                      id={`level_min_${level.key}`}
                      type="number"
                      min={0}
                      disabled={index === 0}
                      value={level.minPoints}
                      onChange={(event) => setLevel(index, { minPoints: toInt(event.target.value) })}
                      className="input-som disabled:opacity-60"
                      aria-label="Points minimum"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="help-som m-0 mt-2">Nom du niveau et nombre de points minimum. Le premier commence à 0.</p>
          </div>

          <div>
            <p className="m-0 mb-3 text-[11px] uppercase tracking-[0.18em] text-[var(--som-gray)]">Segments clients</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {SEGMENT_FIELDS.map((field) => (
                <Field key={field.key} id={`rule_${field.key}`} label={field.label} hint={field.hint}>
                  <input
                    id={`rule_${field.key}`}
                    type="number"
                    min={0}
                    value={form.segmentRules[field.key]}
                    onChange={(event) => setRule(field.key, event.target.value)}
                    className="input-som"
                  />
                </Field>
              ))}
            </div>
          </div>

          <p
            role="status"
            className={`m-0 min-h-4 text-[12px] ${message?.tone === "error" ? "text-[var(--som-error)]" : "text-[var(--som-success)]"}`}
          >
            {message?.text ?? ""}
          </p>
        </div>
      </AdminCard>
    </form>
  );
}
