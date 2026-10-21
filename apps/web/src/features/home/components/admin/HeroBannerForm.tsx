"use client";

import { useState } from "react";
import { Tabs } from "@/shared/components/admin/ui/Tabs";
import { useHeroBannerForm } from "../../hooks/useHeroBannerForm";
import type { HeroBannerData } from "../../types";
import { ContentTab } from "./hero-banner/ContentTab";
import { HeroPreview } from "./hero-banner/HeroPreview";
import { HeroSaveActions } from "./hero-banner/HeroSaveActions";
import { LayoutTab } from "./hero-banner/LayoutTab";
import { MediaTab } from "./hero-banner/MediaTab";
import { StyleTab } from "./hero-banner/StyleTab";
import { HERO_TABS, type HeroTab } from "./hero-banner/tabs";
import { VisibilityCard } from "./hero-banner/VisibilityCard";

type HeroBannerFormProps = {
  data: HeroBannerData | null;
};

export function HeroBannerForm({ data }: HeroBannerFormProps) {
  const { form, updateField, submit, isPending, message } = useHeroBannerForm(data);
  const [activeTab, setActiveTab] = useState<HeroTab>("layout");
  const actions = <HeroSaveActions isPending={isPending} message={message} onSave={submit} />;

  const body = (
    <>
      <Tabs items={HERO_TABS} value={activeTab} onChange={setActiveTab} label="Sections du hero" />
      <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0 space-y-6">
          {activeTab === "layout" && (
            <LayoutTab value={form.layout} onChange={(value) => updateField("layout", value)} />
          )}
          {activeTab === "content" && <ContentTab form={form} onChange={updateField} />}
          {activeTab === "media" && <MediaTab form={form} onChange={updateField} />}
          {activeTab === "style" && <StyleTab form={form} onChange={updateField} />}
        </div>
        <div className="space-y-6 xl:sticky xl:top-6">
          <HeroPreview form={form} />
          <VisibilityCard isActive={form.is_active} onChange={(value) => updateField("is_active", value)} />
        </div>
      </div>
    </>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="m-0 text-[14px] font-light text-[var(--som-gray)]">
          Personnalisez la bannière de la page d&apos;accueil.
        </p>
        {actions}
      </div>
      {body}
    </div>
  );
}
