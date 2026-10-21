import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import type { HeroBannerInput } from "../../../types";
import { DesktopFrame, MobileFrame } from "./PreviewFrames";

const DEVICES = [
  { value: "desktop", label: "Aperçu ordinateur", icon: Monitor },
  { value: "mobile", label: "Aperçu mobile", icon: Smartphone },
] as const;

type Device = (typeof DEVICES)[number]["value"];

export function HeroPreview({ form }: { form: HeroBannerInput }) {
  const [device, setDevice] = useState<Device>("desktop");

  return (
    <AdminCard
      title="Aperçu"
      action={
        <div role="group" aria-label="Appareil" className="flex border border-[var(--som-border)]">
          {DEVICES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              aria-label={label}
              aria-pressed={device === value}
              onClick={() => setDevice(value)}
              className={`flex h-10 w-10 cursor-pointer items-center justify-center transition-colors ${
                device === value
                  ? "bg-[var(--som-primary-50)] text-[var(--som-primary)]"
                  : "text-[var(--som-gray)] hover:text-[var(--som-ink)]"
              }`}
            >
              <Icon size={16} strokeWidth={1.5} aria-hidden />
            </button>
          ))}
        </div>
      }
    >
      {device === "desktop" ? <DesktopFrame form={form} /> : <MobileFrame form={form} />}
      <p className="m-0 mt-4 text-[12px] font-light text-[var(--som-gray)]">
        Rendu indicatif de la page d&apos;accueil, mis à jour en direct.
      </p>
    </AdminCard>
  );
}
