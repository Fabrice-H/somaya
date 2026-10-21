import { Tabs } from "@/shared/components/admin/ui/Tabs";
import { LOT_FORM_TABS } from "@/features/lots/constants";
import type { LotFormTab } from "@/features/lots/types";

type LotFormTabsProps = {
  active: LotFormTab;
  onChange: (tab: LotFormTab) => void;
};

const ITEMS = LOT_FORM_TABS.map((tab) => ({ value: tab.key, label: tab.label }));

export function LotFormTabs({ active, onChange }: LotFormTabsProps) {
  return <Tabs label="Sections du lot" items={ITEMS} value={active} onChange={onChange} />;
}
