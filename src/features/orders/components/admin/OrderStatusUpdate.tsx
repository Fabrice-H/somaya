"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "../../server/actions";
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from "../../constants";
import type { OrderStatus } from "../../types";

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: OrderStatus;
}

type Feedback = { type: "success" | "error"; text: string };

const FEEDBACK_DURATION_MS = 3000;

export function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (feedback?.type !== "success") return;
    const timer = setTimeout(() => setFeedback(null), FEEDBACK_DURATION_MS);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleChange = (next: OrderStatus) => {
    if (next === status) return;
    const previous = status;
    setStatus(next);
    setFeedback(null);

    startTransition(async () => {
      const result = await updateOrderStatus({ id: orderId, status: next });
      if (result.ok) {
        setFeedback({ type: "success", text: "Statut mis à jour" });
        router.refresh();
      } else {
        setFeedback({ type: "error", text: result.error });
        setStatus(previous);
      }
    });
  };

  return (
    <div className="relative w-full sm:w-[220px]">
      <select
        aria-label="Statut de la commande"
        aria-invalid={feedback?.type === "error" ? "true" : undefined}
        value={status}
        onChange={(event) => handleChange(event.target.value as OrderStatus)}
        disabled={isPending}
        className={`input-som min-h-10! py-0! text-[13px]! ${isPending ? "cursor-wait" : "cursor-pointer"}`}
      >
        {ORDER_STATUSES.map((value) => (
          <option key={value} value={value}>
            {ORDER_STATUS_LABELS[value]}
          </option>
        ))}
      </select>
      <p
        role="status"
        className={`m-0 mt-1.5 min-h-4 text-[12px] font-light sm:absolute sm:left-0 sm:top-full ${
          feedback?.type === "error" ? "text-[var(--som-error)]" : "text-[var(--som-success)]"
        }`}
      >
        {feedback?.text}
      </p>
    </div>
  );
}
