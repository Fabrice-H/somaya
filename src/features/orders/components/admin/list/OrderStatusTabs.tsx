import { Tabs } from "@/shared/components/admin/ui/Tabs";
import { ORDER_STATUS_FILTERS } from "../../../constants";
import type { OrdersStats } from "../../../types";

interface OrderStatusTabsProps {
  current: string;
  stats: OrdersStats;
  disabled: boolean;
  onChange: (status: string) => void;
}

export function OrderStatusTabs({ current, stats, disabled, onChange }: OrderStatusTabsProps) {
  const items = ORDER_STATUS_FILTERS.map(({ value, label }) => ({
    value,
    label,
    count: value === "all" ? stats.total : stats[value],
  }));

  return (
    <div aria-busy={disabled} className={disabled ? "pointer-events-none opacity-60" : undefined}>
      <Tabs<string> items={items} value={current} onChange={onChange} label="Filtrer par statut" />
    </div>
  );
}
