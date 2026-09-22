import { Banknote, CreditCard, ShieldCheck, Smartphone, type LucideIcon } from "lucide-react";
import type { PaymentMethod } from "../../types";

export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, LucideIcon> = {
  mobile_money: Smartphone,
  cash: Banknote,
  bank_transfer: CreditCard,
  online: ShieldCheck,
};
