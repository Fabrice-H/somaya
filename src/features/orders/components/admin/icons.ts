import {
  AlertCircle,
  Banknote,
  CheckCircle,
  CreditCard,
  Package,
  Smartphone,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { OrderStatus, PaymentMethod } from "../../types";

export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, LucideIcon> = {
  mobile_money: Smartphone,
  cash: Banknote,
  bank_transfer: CreditCard,
};

export const ORDER_STATUS_ICONS: Record<OrderStatus, LucideIcon> = {
  pending: AlertCircle,
  confirmed: CheckCircle,
  preparing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};
