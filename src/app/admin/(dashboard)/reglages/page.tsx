import { Suspense } from "react";
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
  const [settings, testimonials, heroBanner] = await Promise.all([getSettings(), getTestimonials(), getHeroBanner()]);
  return <SettingsClient settings={settings} testimonials={testimonials} heroBanner={heroBanner} />;
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent />
    </Suspense>
  );
}
