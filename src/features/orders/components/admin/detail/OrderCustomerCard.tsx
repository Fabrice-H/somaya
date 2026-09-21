import { Mail, MessageSquare, Phone, User } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { telHref } from "@/shared/lib/phone";
import type { OrderDetail } from "../../../types";
import { InfoDivider, InfoLine } from "./InfoLine";

const LINK_CLASS =
  "break-all text-[var(--som-ink)] underline decoration-[var(--som-border-strong)] underline-offset-4 transition-colors hover:text-[var(--som-primary)] hover:decoration-[var(--som-primary)]";

export function OrderCustomerCard({ order }: { order: OrderDetail }) {
  return (
    <AdminCard title="Client">
      <div className="space-y-4">
        <InfoLine icon={User}>
          <p className="m-0 font-medium">{order.customer_name}</p>
        </InfoLine>
        <InfoLine icon={Phone}>
          <a href={telHref(order.customer_phone)} className={`${LINK_CLASS} tabular-nums`}>
            {order.customer_phone}
          </a>
        </InfoLine>
        {order.customer_email && (
          <InfoLine icon={Mail}>
            <a href={`mailto:${order.customer_email}`} className={LINK_CLASS}>
              {order.customer_email}
            </a>
          </InfoLine>
        )}
        {order.customer_notes && (
          <>
            <InfoDivider />
            <InfoLine icon={MessageSquare} label="Note du client">
              <p className="m-0 font-light italic">&ldquo;{order.customer_notes}&rdquo;</p>
            </InfoLine>
          </>
        )}
      </div>
    </AdminCard>
  );
}
