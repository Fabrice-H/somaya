import type { OrderStatus } from "@/features/orders/types";
import type { LoyaltyLevel, LoyaltyTransactionDto } from "@/features/loyalty/types";

export type CustomerSegment = "new" | "active" | "loyal" | "vip" | "inactive";
export type CustomerSegmentFilter = CustomerSegment | "all";
export type CustomerSort = "recent" | "spent" | "orders" | "name";

export type SegmentRules = {
  newDays: number;
  activeDays: number;
  loyalOrders: number;
  vipSpent: number;
  vipOrders: number;
  inactiveDays: number;
};

export type CustomerStatsInput = {
  ordersCount: number;
  totalSpent: number;
  firstOrderAt: Date | null;
  lastOrderAt: Date | null;
};

export interface CustomerSummary {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  email: string | null;
  orders_count: number;
  total_spent: number;
  first_order_at: string | null;
  last_order_at: string | null;
  loyalty_points: number;
  loyalty_level: LoyaltyLevel;
  segment: CustomerSegment;
  created_at: string;
}

export interface CustomerOrder {
  id: string;
  order_number: string;
  status: OrderStatus;
  total: number;
  items_count: number;
  created_at: string;
}

export interface CustomerTopProduct {
  product_name: string;
  product_image: string | null;
  quantity: number;
  orders_count: number;
}

export interface CustomerDetail extends CustomerSummary {
  notes: string | null;
  average_order: number;
  orders: CustomerOrder[];
  top_products: CustomerTopProduct[];
  loyalty_history: LoyaltyTransactionDto[];
}

export interface CustomersFilter {
  segment: CustomerSegmentFilter;
  search: string;
  sort: CustomerSort;
  page: number;
}

export interface PaginatedCustomers {
  customers: CustomerSummary[];
  total: number;
  page: number;
  totalPages: number;
}

export type CustomersStats = Record<CustomerSegment | "total", number>;

export type CustomerActionResult = { ok: true } | { ok: false; error: string };

export type CustomerIdentity = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
};
