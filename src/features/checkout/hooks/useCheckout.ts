import { useState, useTransition } from "react";
import { useCartStore } from "@/features/cart/store";
import { ABIDJAN_COMMUNES } from "../constants";
import {
  checkoutCustomerSchema,
  type CheckoutFormValues,
  type CheckoutPaymentMethod,
  type DeliveryMethod,
} from "../schemas";
import { placeOrder } from "../server/actions";
import type { OnlineOperator } from "@/features/payments/types";
import type { PlacedOrder } from "../types";

type FieldErrors = Record<string, string[]>;

const EMPTY_FORM: CheckoutFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  commune: "",
  address: "",
  notes: "",
};
const DETAIL_FIELDS = ["firstName", "lastName", "phone", "email"] as const;

function detailErrors(values: CheckoutFormValues): FieldErrors {
  const result = checkoutCustomerSchema
    .pick({ firstName: true, lastName: true, phone: true, email: true })
    .safeParse(values);
  if (result.success) return {};
  return result.error.issues.reduce<FieldErrors>((errors, issue) => {
    const key = String(issue.path[0]);
    errors[key] = [...(errors[key] ?? []), issue.message];
    return errors;
  }, {});
}

export function useCheckout(initialCustomer: CheckoutFormValues | null = null) {
  const itemsByKey = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const items = Object.values(itemsByKey);

  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState<CheckoutFormValues>(initialCustomer ?? EMPTY_FORM);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>("cash");
  const [operator, setOperator] = useState<OnlineOperator | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateField = (field: keyof CheckoutFormValues, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: [] }));
  };

  const goTo = (next: number) => {
    setError(null);
    setStep(next);
  };

  const continueFromDetails = () => {
    const errors = detailErrors(customer);
    setFieldErrors(errors);
    if (DETAIL_FIELDS.every((field) => !errors[field]?.length)) goTo(1);
  };

  const continueFromShipping = () => {
    if (deliveryMethod === "delivery" && !(ABIDJAN_COMMUNES as readonly string[]).includes(customer.commune)) {
      setFieldErrors((current) => ({ ...current, commune: ["Choisissez votre commune"] }));
      return;
    }
    goTo(2);
  };

  const submit = () => {
    setError(null);
    if (paymentMethod === "online" && !operator) {
      setError("Choisissez votre opérateur mobile money.");
      return;
    }
    startTransition(async () => {
      const result = await placeOrder({
        customer,
        deliveryMethod,
        paymentMethod,
        operator: paymentMethod === "online" ? operator : null,
        lines: items.map(({ productId, lotId, itemId, quantity }) => ({ productId, lotId, itemId, quantity })),
      });
      if (!result.ok) {
        setError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }
      clearCart();
      if (result.order.checkoutUrl) {
        window.location.assign(result.order.checkoutUrl);
        return;
      }
      setPlaced(result.order);
    });
  };

  return {
    items,
    step,
    goTo,
    customer,
    updateField,
    deliveryMethod,
    setDeliveryMethod,
    paymentMethod,
    setPaymentMethod,
    operator,
    setOperator,
    fieldErrors,
    error,
    isPending,
    continueFromDetails,
    continueFromShipping,
    submit,
    placed,
  };
}
