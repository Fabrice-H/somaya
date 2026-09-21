"use client";

import { AdminPage } from "@/shared/components/admin/ui/AdminPage";
import { ADMIN_LOTS_PATH } from "@/features/lots/constants";
import { useLotForm } from "@/features/lots/hooks/useLotForm";
import { DeleteLotDialog } from "./DeleteLotDialog";
import { LotFormActions } from "./LotFormActions";
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
      <AdminPage
        eyebrow="Boutique · Par budget"
        title={lot ? "Modifier le lot" : "Nouveau lot de prix"}
        description={fields.name || "Définissez un prix unique et les articles du lot."}
        back={{ href: ADMIN_LOTS_PATH, label: "Lots de prix" }}
        actions={
          <LotFormActions
            isEdit={!!lot}
            canSubmit={!!fields.name}
            isPending={form.isPending}
            onDelete={() => form.setShowDeleteDialog(true)}
          />
        }
      >
        <LotFormTabs active={form.activeTab} onChange={form.setActiveTab} />

        {form.error && (
          <p
            role="alert"
            className="m-0 mt-6 border border-[var(--som-error)] bg-[var(--som-error-tint)] px-4 py-3 text-[14px] text-[var(--som-error)]"
          >
            {form.error}
          </p>
        )}

        <div className="mt-6 space-y-6">
          {form.activeTab === "articles" ? (
            <>
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
            </>
          ) : (
            <LotSettingsSection isActive={fields.isActive} onChange={form.setIsActive} />
          )}
        </div>
      </AdminPage>

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
