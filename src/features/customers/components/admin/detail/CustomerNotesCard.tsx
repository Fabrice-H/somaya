"use client";

import { useState, useTransition } from "react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { CUSTOMER_NOTES_MAX_LENGTH } from "../../../constants";
import { updateCustomerNotes } from "../../../server/actions";

export function CustomerNotesCard({ customerId, notes }: { customerId: string; notes: string | null }) {
  const [value, setValue] = useState(notes ?? "");
  const [saved, setSaved] = useState(notes ?? "");
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const dirty = value.trim() !== saved.trim();

  const save = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await updateCustomerNotes({ id: customerId, notes: value });
      if (!result.ok) {
        setMessage({ tone: "error", text: result.error });
        return;
      }
      setSaved(value);
      setMessage({ tone: "ok", text: "Note enregistrée" });
    });
  };

  return (
    <AdminCard title="Note interne" description="Visible uniquement par l'équipe.">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={CUSTOMER_NOTES_MAX_LENGTH}
        rows={4}
        placeholder="Préférences, adresse habituelle, remarques…"
        aria-label="Note interne"
        className="input-som resize-y"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <p
          role="status"
          className={`m-0 text-[12px] ${message?.tone === "error" ? "text-[var(--som-error)]" : "text-[var(--som-gray)]"}`}
        >
          {message?.text ?? ""}
        </p>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || isPending}
          className="btn-primary btn-sm disabled:opacity-50"
        >
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </AdminCard>
  );
}
