import { AdminCard } from "@/shared/components/admin/ui/AdminCard";

type LotSettingsSectionProps = {
  isActive: boolean;
  onChange: (value: boolean) => void;
};

export function LotSettingsSection({ isActive, onChange }: LotSettingsSectionProps) {
  return (
    <div className="max-w-[640px]">
      <AdminCard title="Visibilité">
        <label className="flex min-h-12 cursor-pointer items-center gap-4">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => onChange(e.target.checked)}
            className="h-5 w-5 shrink-0 cursor-pointer accent-[var(--som-primary)]"
          />
          <span>
            <span className="block text-[14px] text-[var(--som-ink)]">Lot actif</span>
            <span className="mt-0.5 block text-[12px] font-light text-[var(--som-gray)]">
              Le lot sera visible sur le site.
            </span>
          </span>
        </label>
      </AdminCard>
    </div>
  );
}
