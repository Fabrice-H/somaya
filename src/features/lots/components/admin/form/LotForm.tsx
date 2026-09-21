"use client";

import { useLotForm } from "@/features/lots/hooks/useLotForm";
import { DeleteLotDialog } from "./DeleteLotDialog";
import { LotFormHeader } from "./LotFormHeader";
import { LotFormTabs } from "./LotFormTabs";
import { LotInfoSection } from "./LotInfoSection";
import { LotItemsSection } from "./LotItemsSection";
import { LotSettingsSection } from "./LotSettingsSection";
import type { CategoryOption } from "@/features/categories/types";
import type { PriceLot } from "@/features/lots/types";

type LotFormProps = {
  lot?: PriceLot | null;
  categories: CategoryOption[];
};

export function LotForm({ lot, categories }: LotFormProps) {
  const form = useLotForm(lot);
  const { fields, items } = form;

  return (
    <form onSubmit={form.submit}>
      <LotFormHeader
        isEdit={!!lot}
        name={fields.name}
        isPending={form.isPending}
        onBack={form.back}
        onDelete={() => form.setShowDeleteDialog(true)}
      />

      <LotFormTabs active={form.activeTab} onChange={form.setActiveTab} />

      {form.error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700" style={{ margin: "24px 40px 0" }}>
          {form.error}
        </div>
      )}

      <div style={{ padding: "32px 40px" }}>
        {form.activeTab === "articles" ? (
          <div style={{ maxWidth: 1000 }}>
            <LotInfoSection
              name={fields.name}
              price={fields.price}
              categoryId={fields.categoryId}
              categories={categories}
              onNameChange={form.setName}
              onPriceChange={form.setPrice}
              onCategoryChange={form.setCategoryId}
            />
            <LotItemsSection
              items={items.items}
              uploadingIds={items.uploadingIds}
              onAdd={items.add}
              onRemove={items.remove}
              onUpdate={items.update}
              onUpload={items.upload}
            />
          </div>
        ) : (
          <LotSettingsSection isActive={fields.isActive} onChange={form.setIsActive} />
        )}
      </div>

      {lot && form.showDeleteDialog && (
        <DeleteLotDialog
          name={lot.name}
          isDeleting={form.isDeleting}
          onCancel={() => form.setShowDeleteDialog(false)}
          onConfirm={form.remove}
        />
      )}
    </form>
  );
}
