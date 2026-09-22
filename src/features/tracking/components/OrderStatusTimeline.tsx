import { Check, X } from "lucide-react";
import type { OrderStatus } from "@/features/orders/types";
import { ORDER_STATUS_INDEX, ORDER_STEPS } from "../constants";

export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 border border-[var(--som-border)] px-5 py-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--som-error-tint)] text-[var(--som-error)]">
          <X size={15} strokeWidth={1.6} aria-hidden />
        </span>
        <div>
          <p className="m-0 text-[14px] font-medium text-[var(--som-ink)]">Commande annulée</p>
          <p className="m-0 mt-0.5 text-[13px] font-light text-[#4a4a4a]">
            Une question ? Notre équipe est disponible sur WhatsApp.
          </p>
        </div>
      </div>
    );
  }

  const current = ORDER_STATUS_INDEX[status];
  return (
    <ol className="m-0 grid list-none gap-0 p-0 sm:grid-cols-5">
      {ORDER_STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.status} className="relative flex gap-4 pb-6 sm:block sm:pb-0">
            <div className="flex flex-col items-center sm:mb-3 sm:flex-row">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[12px] tabular-nums ${
                  done || active
                    ? "border-[var(--som-primary)] bg-[var(--som-primary)] text-white"
                    : "border-[var(--som-border-strong)] bg-white text-[var(--som-gray)]"
                }`}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check size={14} strokeWidth={2} aria-hidden /> : index + 1}
              </span>
              {index < ORDER_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={`mt-1 h-full w-px flex-1 sm:mt-0 sm:ml-1 sm:h-px sm:w-auto ${done ? "bg-[var(--som-primary)]" : "bg-[var(--som-border)]"}`}
                />
              )}
            </div>
            <div className="sm:pr-4">
              <p
                className={`m-0 text-[13px] ${active || done ? "font-medium text-[var(--som-ink)]" : "font-light text-[var(--som-gray)]"}`}
              >
                {step.label}
              </p>
              {active && (
                <p className="m-0 mt-1 text-[12px] font-light leading-relaxed text-[#4a4a4a]">{step.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
