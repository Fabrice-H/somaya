import "server-only";
import type { EventBus } from "@/features/events/bus";
import { isOrderEvent } from "@/features/events/types";
import { creditDeliveredOrder, revokeOrderPoints } from "./service";

export function registerLoyaltyHandlers(bus: EventBus) {
  bus.register({
    id: "loyalty.credit",
    on: ["order.delivered"],
    run: async (event) => {
      if (!isOrderEvent(event)) return;
      const result = await creditDeliveredOrder(event.orderId);
      if (result.credited && result.customerId) {
        await bus.emit({
          type: "loyalty.points_added",
          customerId: result.customerId,
          orderId: event.orderId,
          points: result.points,
        });
      }
    },
  });

  bus.register({
    id: "loyalty.revoke",
    on: ["order.cancelled"],
    run: async (event) => {
      if (!isOrderEvent(event)) return;
      await revokeOrderPoints(event.orderId);
    },
  });
}
