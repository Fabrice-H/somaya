"use client";

import { useState } from "react";
import { HeroBannerForm } from "@/features/home/components/admin/HeroBannerForm";
import type { HeroBannerData } from "@/features/home/types";
import { TestimonialsManager } from "@/features/testimonials/components/admin/TestimonialsManager";
import type { TestimonialData } from "@/features/testimonials/types";
import { useSettingsForm } from "../../hooks/useSettingsForm";
import type { StoreSettings } from "../../types";
import { AppearanceTab } from "./settings/AppearanceTab";
import { ContactTab } from "./settings/ContactTab";
import { DeliveryTab } from "./settings/DeliveryTab";
import { FormMessage } from "./settings/FormMessage";
import { SettingsHeader } from "./settings/SettingsHeader";
import { SettingsTabsNav } from "./settings/SettingsTabsNav";
import { StoreTab } from "./settings/StoreTab";
import { cardStyle } from "./settings/styles";
import { isFormTab, type SettingsTab } from "./settings/tabs";

type SettingsClientProps = {
  settings: StoreSettings | null;
  testimonials: TestimonialData[];
  heroBanner: HeroBannerData | null;
};

const embeddedPanelClass = "bg-white border border-[#511f29]/10 rounded-lg overflow-hidden";

export function SettingsClient({ settings, testimonials, heroBanner }: SettingsClientProps) {
  const { form, updateField, submit, isPending, message } = useSettingsForm(settings);
  const [activeTab, setActiveTab] = useState<SettingsTab>("boutique");
  const showForm = isFormTab(activeTab);

  return (
    <div>
      <SettingsHeader showSave={showForm} isPending={isPending} onSave={submit} />
      {message && <FormMessage type={message.type} text={message.text} />}

      <div style={{ padding: "32px 40px" }}>
        <div className="flex gap-8">
          <SettingsTabsNav activeTab={activeTab} onChange={setActiveTab} />

          <div className="flex-1">
            {showForm && (
              <div className="bg-white max-w-2xl" style={cardStyle}>
                {activeTab === "boutique" && <StoreTab form={form} onChange={updateField} />}
                {activeTab === "contact" && <ContactTab form={form} onChange={updateField} />}
                {activeTab === "livraison" && <DeliveryTab form={form} onChange={updateField} />}
                {activeTab === "apparence" && <AppearanceTab form={form} onChange={updateField} />}
              </div>
            )}

            {activeTab === "hero" && (
              <div className={embeddedPanelClass}>
                <HeroBannerForm data={heroBanner} embedded />
              </div>
            )}

            {activeTab === "temoignages" && (
              <div className={embeddedPanelClass}>
                <TestimonialsManager initialData={testimonials} embedded />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
