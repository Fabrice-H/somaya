type LotSettingsSectionProps = {
  isActive: boolean;
  onChange: (value: boolean) => void;
};

export function LotSettingsSection({ isActive, onChange }: LotSettingsSectionProps) {
  return (
    <div style={{ maxWidth: 600 }}>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-medium text-[#3c161e] mb-4">Options</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => onChange(e.target.checked)}
            className="w-5 h-5 rounded border-black text-[#3c161e] focus:ring-black/10"
          />
          <div>
            <span className="text-sm font-medium text-[#000000]">Lot actif</span>
            <p className="text-xs text-[#6b6b6b]">Le lot sera visible sur le site</p>
          </div>
        </label>
      </div>
    </div>
  );
}
