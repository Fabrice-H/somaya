import clsx from "clsx";
import { HERO_TABS, type HeroTab } from "./tabs";

type HeroTabsNavProps = {
  activeTab: HeroTab;
  onTabChange: (tab: HeroTab) => void;
  isActive: boolean;
  onActiveChange: (value: boolean) => void;
};

export function HeroTabsNav({ activeTab, onTabChange, isActive, onActiveChange }: HeroTabsNavProps) {
  return (
    <div className="w-48 flex-shrink-0">
      <nav className="space-y-1">
        {HERO_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
              activeTab === id ? "bg-[#511f29] text-white" : "text-[#3c161e]/70 hover:bg-[#511f29]/5"
            )}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-6 p-4 bg-white rounded-lg border border-[#511f29]/10">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => onActiveChange(event.target.checked)}
            className="w-5 h-5 rounded border-black text-[#3c161e] focus:ring-black/10"
          />
          <div>
            <span className="font-medium text-sm text-[#000000]">Actif</span>
            <p className="text-xs text-[#4a4a4a]">Afficher sur le site</p>
          </div>
        </label>
      </div>
    </div>
  );
}
