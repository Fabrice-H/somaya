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
    <div>
      <select
        aria-label="Statut de la commande"
        value={status}
        onChange={(event) => handleChange(event.target.value as OrderStatus)}
        disabled={isPending}
        style={{
          width: "100%",
          padding: "10px 14px",
          fontSize: 14,
          border: "1px solid rgba(81,31,41,0.2)",
          background: "white",
          color: "#000000",
          cursor: isPending ? "wait" : "pointer",
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {ORDER_STATUSES.map((value) => (
          <option key={value} value={value}>
            {ORDER_STATUS_LABELS[value]}
          </option>
        ))}
      </select>
      {feedback && (
        <p style={{ marginTop: 8, fontSize: 12, color: feedback.type === "success" ? "#065F46" : "#991B1B" }}>
          {feedback.text}
        </p>
      )}
    </div>
  );
}
