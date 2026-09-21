"use client";

import { useState } from "react";
import { HeroBannerForm } from "@/features/home/components/admin/HeroBannerForm";
import type { HeroBannerData } from "@/features/home/types";
import { TestimonialsManager } from "@/features/testimonials/components/admin/TestimonialsManager";
import type { TestimonialData } from "@/features/testimonials/types";
import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import { Tabs } from "@/shared/components/admin/ui/Tabs";
import { useSettingsForm } from "../../hooks/useSettingsForm";
import type { StoreSettings } from "../../types";
import { AppearanceTab } from "./settings/AppearanceTab";
import { ContactTab } from "./settings/ContactTab";
import { DeliveryTab } from "./settings/DeliveryTab";
import { SaveBar } from "./settings/SaveBar";
import { StoreTab } from "./settings/StoreTab";
import { isFormTab, SETTINGS_TABS, type SettingsTab } from "./settings/tabs";

type SettingsClientProps = {
  settings: StoreSettings | null;
  testimonials: TestimonialData[];
  heroBanner: HeroBannerData | null;
};

export function SettingsClient({ settings, testimonials, heroBanner }: SettingsClientProps) {
  const { form, updateField, submit, isPending, message } = useSettingsForm(settings);
  const [activeTab, setActiveTab] = useState<SettingsTab>("boutique");

  return (
    <AdminPage
      eyebrow="Configuration"
      title="Réglages"
      description="Identité, contact, livraison et apparence de votre boutique."
    >
      <Tabs items={SETTINGS_TABS} value={activeTab} onChange={setActiveTab} label="Sections des réglages" />

      <div className="mt-8">
        {isFormTab(activeTab) && (
          <div className="max-w-[960px]">
            {activeTab === "boutique" && <StoreTab form={form} onChange={updateField} />}
            {activeTab === "contact" && <ContactTab form={form} onChange={updateField} />}
            {activeTab === "livraison" && <DeliveryTab form={form} onChange={updateField} />}
            {activeTab === "apparence" && <AppearanceTab form={form} onChange={updateField} />}
            <SaveBar isPending={isPending} message={message} onSave={submit} />
          </div>
        )}

        {activeTab === "hero" && <HeroBannerForm data={heroBanner} />}

        {activeTab === "temoignages" && <TestimonialsManager initialData={testimonials} />}
      </div>
    </AdminPage>
  );
}
