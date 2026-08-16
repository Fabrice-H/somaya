import clsx from "clsx";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "En attente",
    className: "bg-amber-100 text-amber-700",
  },
  confirmed: {
    label: "Confirmee",
    className: "bg-blue-100 text-blue-700",
  },
  preparing: {
    label: "En preparation",
    className: "bg-indigo-100 text-indigo-700",
  },
  shipped: {
    label: "Expediee",
    className: "bg-purple-100 text-purple-700",
  },
  delivered: {
    label: "Livree",
    className: "bg-emerald-100 text-emerald-700",
  },
  cancelled: {
    label: "Annulee",
    className: "bg-red-100 text-red-700",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
