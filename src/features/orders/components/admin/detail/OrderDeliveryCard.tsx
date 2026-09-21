import { MapPin } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import type { OrderDetail } from "../../../types";
import { InfoLine } from "./InfoLine";

export function OrderDeliveryCard({ order }: { order: Pick<OrderDetail, "customer_address" | "customer_commune"> }) {
  return (
    <AdminCard title="Livraison">
      <InfoLine icon={MapPin} label="Adresse">
        {order.customer_address && <p className="m-0">{order.customer_address}</p>}
        <p className="m-0 font-light text-[var(--som-gray)]">{order.customer_commune ?? "Commune non renseignée"}</p>
      </InfoLine>
    </AdminCard>
  );
}
