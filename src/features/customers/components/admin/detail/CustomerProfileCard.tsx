import { Mail, Phone, Tag, User } from "lucide-react";
import { AdminCard } from "@/shared/components/admin/ui/AdminCard";
import { formatPhone, telHref } from "@/shared/lib/phone";
import { SEGMENT_BADGES } from "../../../constants";
import type { CustomerDetail } from "../../../types";
import { SegmentBadge } from "../SegmentBadge";

const LINK_CLASS =
  "break-all text-[var(--som-ink)] underline decoration-[var(--som-border-strong)] underline-offset-4 transition-colors hover:text-[var(--som-primary)] hover:decoration-[var(--som-primary)]";

function Line({ icon: Icon, children }: { icon: typeof User; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} strokeWidth={1.5} aria-hidden className="mt-0.5 shrink-0 text-[var(--som-gray)]" />
      <div className="min-w-0 text-[14px] text-[var(--som-ink)]">{children}</div>
    </div>
  );
}

export function CustomerProfileCard({ customer }: { customer: CustomerDetail }) {
  return (
    <AdminCard title="Profil">
      <div className="space-y-4">
        <Line icon={User}>
          <p className="m-0 font-medium">{customer.full_name}</p>
        </Line>
        <Line icon={Phone}>
          <a href={telHref(customer.phone)} className={`${LINK_CLASS} tabular-nums`}>
            {formatPhone(customer.phone)}
          </a>
        </Line>
        <Line icon={Mail}>
          {customer.email ? (
            <a href={`mailto:${customer.email}`} className={LINK_CLASS}>
              {customer.email}
            </a>
          ) : (
            <span className="font-light text-[var(--som-gray)]">Pas d&apos;email</span>
          )}
        </Line>
        <Line icon={Tag}>
          <div className="flex flex-wrap items-center gap-2">
            <SegmentBadge segment={customer.segment} />
            <span className="text-[12px] font-light text-[var(--som-gray)]">
              {SEGMENT_BADGES[customer.segment].description}
            </span>
          </div>
        </Line>
      </div>
    </AdminCard>
  );
}
