import { Mail, MapPin, MessageSquare, Phone, User } from "lucide-react";
import { telHref } from "@/shared/lib/phone";
import type { OrderDetail } from "../../../types";
import { InfoDivider, InfoLine } from "./InfoLine";
import { OrderPanel } from "./OrderPanel";

const LINK_STYLE = { fontSize: 14, color: "#3c161e" } as const;

export function OrderCustomerCard({ order }: { order: OrderDetail }) {
  return (
    <OrderPanel icon={User} title="Client">
      <div className="space-y-4" style={{ padding: "20px 24px" }}>
        <InfoLine icon={User}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#000000" }}>{order.customer_name}</p>
        </InfoLine>
        <InfoLine icon={Phone}>
          <a href={telHref(order.customer_phone)} style={LINK_STYLE}>
            {order.customer_phone}
          </a>
        </InfoLine>
        {order.customer_email && (
          <InfoLine icon={Mail}>
            <a href={`mailto:${order.customer_email}`} style={LINK_STYLE}>
              {order.customer_email}
            </a>
          </InfoLine>
        )}
        <InfoDivider />
        <InfoLine icon={MapPin}>
          {order.customer_address && <p style={{ fontSize: 14, color: "#000000" }}>{order.customer_address}</p>}
          <p style={{ fontSize: 13, color: "#6b6b6b" }}>{order.customer_commune}</p>
        </InfoLine>
        {order.customer_notes && (
          <>
            <InfoDivider />
            <InfoLine icon={MessageSquare}>
              <p style={{ fontSize: 12, color: "#6b6b6b", marginBottom: 4 }}>Notes du client</p>
              <p style={{ fontSize: 14, color: "#000000", fontStyle: "italic" }}>
                &ldquo;{order.customer_notes}&rdquo;
              </p>
            </InfoLine>
          </>
        )}
      </div>
    </OrderPanel>
  );
}
