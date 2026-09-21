import type { OrderSummary } from "../../../types";
import { OrderRow } from "./OrderRow";
import { ORDERS_GRID_COLUMNS, ORDERS_TABLE_COLUMNS } from "./table-layout";

export function OrdersTable({ orders }: { orders: OrderSummary[] }) {
  return (
    <div style={{ background: "white", border: "1px solid rgba(81,31,41,0.1)", overflow: "hidden" }}>
      <div
        className="hidden md:grid"
        style={{
          gridTemplateColumns: ORDERS_GRID_COLUMNS,
          gap: 16,
          padding: "14px 20px",
          background: "#fafafa",
          borderBottom: "1px solid rgba(81,31,41,0.1)",
        }}
      >
        {ORDERS_TABLE_COLUMNS.map((column) => (
          <span
            key={column.label}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#6b6b6b",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              textAlign: "align" in column ? column.align : undefined,
            }}
          >
            {column.label}
          </span>
        ))}
        <span />
      </div>
      {orders.map((order, index) => (
        <OrderRow key={order.id} order={order} isLast={index === orders.length - 1} />
      ))}
    </div>
  );
}
