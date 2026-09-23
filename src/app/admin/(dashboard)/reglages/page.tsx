import { Suspense } from "react";
import { getAutomationsOverview } from "@/features/automations/server/queries";
import { getSettings } from "@/features/settings/server/queries";
import { getTestimonials } from "@/features/testimonials/server/queries";
import { getHeroBanner } from "@/features/home/server/queries";
import { SettingsClient } from "@/features/settings/components/admin/SettingsClient";
import { SettingsSkeleton } from "@/features/settings/components/admin/settings/SettingsSkeleton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Réglages | Admin SO'MAYA",
};

async function SettingsContent() {
  const [settings, testimonials, heroBanner, automations] = await Promise.all([
    getSettings(),
    getTestimonials(),
    getHeroBanner(),
    getAutomationsOverview(),
  ]);
  return (
    <SettingsClient settings={settings} testimonials={testimonials} heroBanner={heroBanner} automations={automations} />
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent />
    </Suspense>
  );
}
