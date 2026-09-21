"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSettings } from "../server/actions";
import type { SettingsFieldUpdater, SettingsInput, StoreSettings } from "../types";
import { toSettingsInput } from "../utils";

type Message = { type: "success" | "error"; text: string };

export function useSettingsForm(settings: StoreSettings | null) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<Message | null>(null);
  const [form, setForm] = useState<SettingsInput>(() => toSettingsInput(settings));

  const updateField: SettingsFieldUpdater = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await updateSettings(form);
      if (result.success) {
        setMessage({ type: "success", text: "Paramètres enregistrés" });
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.error || "Erreur" });
      }
    });
  };

  return { form, updateField, submit, isPending, message };
}
