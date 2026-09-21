import { ORDER_STATUS_COLORS, ORDER_STATUS_FILTERS } from "../../../constants";
import type { OrdersStats } from "../../../types";

interface OrderStatusTabsProps {
  current: string;
  stats: OrdersStats;
  disabled: boolean;
  onChange: (status: string) => void;
}

export function OrderStatusTabs({ current, stats, disabled, onChange }: OrderStatusTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ORDER_STATUS_FILTERS.map(({ value, label }) => {
        const isActive = current === value;
        const colors = value === "all" ? null : ORDER_STATUS_COLORS[value];
        const count = value === "all" ? stats.total : stats[value];

        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            disabled={disabled}
            className="inline-flex items-center gap-2 transition-all"
            style={{
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 500,
              border: "1px solid",
              borderColor: isActive ? "transparent" : "rgba(81,31,41,0.15)",
              background: isActive ? (colors?.bg ?? "#511f29") : "#fafafa",
              color: isActive ? (colors?.text ?? "#f1e1e5") : "#6b6b6b",
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? "wait" : "pointer",
            }}
          >
            {label}
            <span
              style={{
                fontSize: 11,
                padding: "2px 6px",
                background: isActive ? "rgba(0,0,0,0.1)" : "rgba(81,31,41,0.1)",
                fontWeight: 600,
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
