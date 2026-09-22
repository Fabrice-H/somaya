import type { LoyaltyLevel, LoyaltyLevelRule, LoyaltyTransactionDto } from "@/features/loyalty/types";
import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/features/orders/types";

export type AccountCustomer = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  commune: string | null;
  loyalty_points: number;
  loyalty_level: LoyaltyLevel;
  account_created_at: string | null;
};

export type AccountOrderSummary = {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  total: number;
  items_count: number;
  created_at: string;
};

export type AccountOrderItem = {
  id: string;
  product_name: string;
  product_image: string | null;
  lot_name: string | null;
  quantity: number;
  line_total: number;
};

export type AccountOrderDetail = AccountOrderSummary & {
  subtotal: number;
  delivery_fee: number;
  address: string | null;
  commune: string | null;
  delivered_at: string | null;
  updated_at: string;
  items: AccountOrderItem[];
};

export type AccountOverview = {
  customer: AccountCustomer;
  orders: AccountOrderSummary[];
  hiddenOrdersCount: number;
  loyalty: { levels: LoyaltyLevelRule[]; nextLevel: LoyaltyLevelRule | null; history: LoyaltyTransactionDto[] };
};

export type AccountActionResult =
  { ok: true; message?: string } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export type AccountFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: string;
  values?: Record<string, string>;
};
