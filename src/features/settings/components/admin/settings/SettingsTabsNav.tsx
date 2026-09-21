import { SETTINGS_TABS, type SettingsTab } from "./tabs";

type SettingsTabsNavProps = {
  activeTab: SettingsTab;
  onChange: (tab: SettingsTab) => void;
};

export function SettingsTabsNav({ activeTab, onChange }: SettingsTabsNavProps) {
  return (
    <div className="w-56 shrink-0">
      <nav className="space-y-1 sticky top-8">
        {SETTINGS_TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
              style={{
                fontSize: 14,
                fontWeight: 500,
                background: active ? "#511f29" : "transparent",
                color: active ? "#f1e1e5" : "#6b6b6b",
              }}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
