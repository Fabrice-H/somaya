"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateHeroBanner } from "../server/actions";
import type { HeroBannerData, HeroBannerInput, HeroFieldUpdater } from "../types";
import { toHeroFormValues } from "../utils";

type Message = { type: "success" | "error"; text: string };

export function useHeroBannerForm(data: HeroBannerData | null) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<Message | null>(null);
  const [form, setForm] = useState<HeroBannerInput>(() => toHeroFormValues(data));

  const updateField: HeroFieldUpdater = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    startTransition(async () => {
      const result = await updateHeroBanner(form);
      if (result.success) {
        setMessage({ type: "success", text: "Hero banner mis à jour avec succès" });
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.error || "Erreur lors de la mise à jour" });
      }
      setTimeout(() => setMessage(null), 3000);
    });
  };

  return { form, updateField, submit, isPending, message };
}
