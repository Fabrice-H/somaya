import "server-only";
import type { EventBus } from "@/features/events/bus";
import { isOrderEvent } from "@/features/events/types";
import { applyOrderStock, restoreOrderStock } from "./service";

export function registerStockHandlers(bus: EventBus) {
  bus.register({
    id: "stock.apply",
    on: ["order.confirmed", "order.paid"],
    run: async (event) => {
      if (!isOrderEvent(event)) return;
      const { warnings } = await applyOrderStock(event.orderId);
      return { warnings };
    },
  });

  bus.register({
    id: "stock.restore",
    on: ["order.cancelled"],
    run: async (event) => {
      if (!isOrderEvent(event)) return;
      await restoreOrderStock(event.orderId);
    },
  });
}
