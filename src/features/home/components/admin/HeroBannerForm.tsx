"use client";

import { useState } from "react";
import { useHeroBannerForm } from "../../hooks/useHeroBannerForm";
import type { HeroBannerData } from "../../types";
import { ContentTab } from "./hero-banner/ContentTab";
import { HeroBannerHeader } from "./hero-banner/HeroBannerHeader";
import { HeroPreview } from "./hero-banner/HeroPreview";
import { HeroTabsNav } from "./hero-banner/HeroTabsNav";
import { LayoutTab } from "./hero-banner/LayoutTab";
import { MediaTab } from "./hero-banner/MediaTab";
import { StyleTab } from "./hero-banner/StyleTab";
import type { HeroTab } from "./hero-banner/tabs";

type HeroBannerFormProps = {
  data: HeroBannerData | null;
  embedded?: boolean;
};

export function HeroBannerForm({ data, embedded = false }: HeroBannerFormProps) {
  const { form, updateField, submit, isPending, message } = useHeroBannerForm(data);
  const [activeTab, setActiveTab] = useState<HeroTab>("layout");

  return (
    <div>
      <HeroBannerHeader embedded={embedded} isPending={isPending} message={message} onSave={submit} />

      <div style={{ padding: embedded ? "16px" : "32px 40px" }}>
        <div className="flex gap-8" style={{ maxWidth: 1200 }}>
          <HeroTabsNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isActive={form.is_active}
            onActiveChange={(value) => updateField("is_active", value)}
          />

          <div className="flex-1">
            {activeTab === "layout" && (
              <LayoutTab value={form.layout} onChange={(value) => updateField("layout", value)} />
            )}
            {activeTab === "content" && <ContentTab form={form} onChange={updateField} />}
            {activeTab === "media" && <MediaTab form={form} onChange={updateField} />}
            {activeTab === "style" && <StyleTab form={form} onChange={updateField} />}
            <HeroPreview form={form} />
          </div>
        </div>
      </div>
    </div>
  );
}
