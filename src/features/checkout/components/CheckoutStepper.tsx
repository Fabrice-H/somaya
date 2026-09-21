import { Check, CreditCard, Truck, User } from "lucide-react";
import { CHECKOUT_STEPS } from "../constants";

const ICONS = [User, Truck, CreditCard];

export function CheckoutStepper({ current, onSelect }: { current: number; onSelect: (step: number) => void }) {
  return (
    <ol className="m-0 flex list-none items-center justify-center gap-3 p-0 sm:gap-5">
      {CHECKOUT_STEPS.map((step, index) => {
        const Icon = ICONS[index];
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.id} className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              disabled={!done}
              onClick={() => onSelect(index)}
              aria-current={active ? "step" : undefined}
              className="flex items-center gap-3 disabled:cursor-default"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center border transition-colors ${
                  done
                    ? "border-[var(--som-primary-200)] bg-[var(--som-primary-50)] text-[var(--som-primary)]"
                    : active
                      ? "border-[var(--som-ink)] bg-[var(--som-ink)] text-white"
                      : "border-[var(--som-border)] text-[#b5b5b5]"
                }`}
              >
                {done ? <Check size={16} strokeWidth={1.8} /> : <Icon size={16} strokeWidth={1.5} />}
              </span>
              <span
                className={`hidden text-[12px] uppercase tracking-[0.18em] sm:inline ${
                  done ? "text-[var(--som-primary)]" : active ? "text-[var(--som-ink)]" : "text-[#b5b5b5]"
                }`}
              >
                {step.label}
              </span>
            </button>
            {index < CHECKOUT_STEPS.length - 1 && (
              <span
                aria-hidden
                className={`h-px w-8 sm:w-20 ${done ? "bg-[var(--som-primary)]" : "bg-[var(--som-border)]"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
