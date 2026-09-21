import { useState, useTransition } from "react";
import { useCartStore } from "@/features/cart/store";
import type { CheckoutFormValues } from "../schemas";
import { placeOrder } from "../server/actions";
import type { PlacedOrder } from "../types";

const EMPTY_FORM: CheckoutFormValues = { firstName: "", lastName: "", phone: "", commune: "", address: "", notes: "" };

export function useCheckout() {
  const itemsByKey = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const items = Object.values(itemsByKey);

  const [customer, setCustomer] = useState<CheckoutFormValues>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateField = (field: keyof CheckoutFormValues, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: [] }));
  };

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const result = await placeOrder({
        customer,
        lines: items.map(({ productId, lotId, itemId, quantity }) => ({ productId, lotId, itemId, quantity })),
      });
      if (!result.ok) {
        setError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }
      setPlaced(result.order);
      clearCart();
    });
  };

  return { items, customer, updateField, fieldErrors, error, isPending, submit, placed };
}
