"use client";

import { Minus, Plus } from "lucide-react";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: "md" | "lg";
  label?: string;
};

export function QuantityStepper({ value, onChange, max, size = "lg", label = "Quantité" }: QuantityStepperProps) {
  const height = size === "lg" ? "h-14" : "h-10";
  const button = `flex ${height} w-11 cursor-pointer items-center justify-center text-[var(--som-ink)] transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-25`;

  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex ${height} items-center border border-[var(--som-border-strong)]`}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Diminuer la quantité"
        className={button}
      >
        <Minus size={15} strokeWidth={1.5} />
      </button>
      <span aria-live="polite" className="min-w-8 text-center text-[15px] tabular-nums text-[var(--som-ink)]">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={max !== undefined && value >= max}
        aria-label="Augmenter la quantité"
        className={button}
      >
        <Plus size={15} strokeWidth={1.5} />
      </button>
    </div>
  );
}
