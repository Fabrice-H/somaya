import { Package, Settings2 } from "lucide-react";
import { LOT_FORM_TABS } from "@/features/lots/constants";
import type { LotFormTab } from "@/features/lots/types";

const TAB_ICONS: Record<LotFormTab, React.ReactNode> = {
  articles: <Package size={16} />,
  settings: <Settings2 size={16} />,
};

type LotFormTabsProps = {
  active: LotFormTab;
  onChange: (tab: LotFormTab) => void;
};

export function LotFormTabs({ active, onChange }: LotFormTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto bg-[#fafafa] border-b border-[var(--som-border)]" style={{ padding: "0 40px" }}>
      {LOT_FORM_TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className="inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            style={{
              padding: "14px 20px",
              fontSize: 13,
              fontWeight: 500,
              color: isActive ? "#511f29" : "#6b6b6b",
              borderBottom: isActive ? "2px solid #511f29" : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {TAB_ICONS[tab.key]}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
