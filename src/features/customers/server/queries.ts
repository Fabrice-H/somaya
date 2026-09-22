import "server-only";
import { and, asc, count, desc, eq, gte, ilike, isNull, lt, ne, or, sql, type SQL } from "drizzle-orm";
import { customers, db, orderItems, orders } from "@/shared/lib/db";
import { escapeLikePattern } from "@/shared/lib/utils";
import { assertAdmin } from "@/features/auth/server/session";
import {
  CUSTOMER_ORDERS_LIMIT,
  CUSTOMER_SEGMENTS,
  CUSTOMER_TOP_PRODUCTS_LIMIT,
  CUSTOMERS_PAGE_SIZE,
} from "../constants";
import { customerIdSchema } from "../schemas";
import { daysAgo } from "../segments";
import { toCustomerSummary } from "./mappers";
import { getSegmentRules } from "./service";
import type {
  CustomerDetail,
  CustomerSegment,
  CustomerSort,
  CustomersFilter,
  CustomersStats,
  PaginatedCustomers,
  SegmentRules,
} from "../types";

function segmentCondition(segment: CustomerSegment, rules: SegmentRules, now: Date): SQL {
  const vip = or(gte(customers.totalSpent, String(rules.vipSpent)), gte(customers.ordersCount, rules.vipOrders))!;
  const notVip = and(lt(customers.totalSpent, String(rules.vipSpent)), lt(customers.ordersCount, rules.vipOrders))!;
  const loyal = gte(customers.ordersCount, rules.loyalOrders);
  const notLoyal = lt(customers.ordersCount, rules.loyalOrders);
  const isNew = and(eq(customers.ordersCount, 1), gte(customers.firstOrderAt, daysAgo(rules.newDays, now)))!;
  const notNew = or(
    ne(customers.ordersCount, 1),
    isNull(customers.firstOrderAt),
    lt(customers.firstOrderAt, daysAgo(rules.newDays, now))
  )!;
  const inactive = or(isNull(customers.lastOrderAt), lt(customers.lastOrderAt, daysAgo(rules.inactiveDays, now)))!;
  const active = gte(customers.lastOrderAt, daysAgo(rules.inactiveDays, now));

  switch (segment) {
    case "vip":
      return vip;
    case "loyal":
      return and(notVip, loyal)!;
    case "new":
      return and(notVip, notLoyal, isNew)!;
    case "inactive":
      return and(notVip, notLoyal, notNew, inactive)!;
    case "active":
      return and(notVip, notLoyal, notNew, active)!;
  }
}

function searchCondition(search: string): SQL | undefined {
  if (!search) return undefined;
  const term = `%${escapeLikePattern(search)}%`;
  const digits = search.replace(/\D/g, "");
  return or(
    ilike(customers.firstName, term),
    ilike(customers.lastName, term),
    ilike(sql`${customers.firstName} || ' ' || ${customers.lastName}`, term),
    ilike(customers.email, term),
    digits.length >= 4 ? ilike(customers.phone, `%${digits}%`) : undefined
  );
}

const SORTS: Record<CustomerSort, SQL[]> = {
  recent: [sql`${customers.lastOrderAt} desc nulls last`, desc(customers.createdAt)],
  spent: [desc(customers.totalSpent), desc(customers.ordersCount)],
  orders: [desc(customers.ordersCount), desc(customers.totalSpent)],
  name: [asc(customers.lastName), asc(customers.firstName)],
};

export async function getCustomers(filter: CustomersFilter): Promise<PaginatedCustomers> {
  await assertAdmin();
  const now = new Date();
  const rules = await getSegmentRules();
  const where = and(
    searchCondition(filter.search),
    filter.segment === "all" ? undefined : segmentCondition(filter.segment, rules, now)
  );

  try {
    const [[{ total }], rows] = await Promise.all([
      db.select({ total: count() }).from(customers).where(where),
      db
        .select()
        .from(customers)
        .where(where)
        .orderBy(...SORTS[filter.sort])
        .limit(CUSTOMERS_PAGE_SIZE)
        .offset((filter.page - 1) * CUSTOMERS_PAGE_SIZE),
    ]);
    return {
      customers: rows.map((row) => toCustomerSummary(row, rules, now)),
      total,
      page: filter.page,
      totalPages: Math.ceil(total / CUSTOMERS_PAGE_SIZE),
    };
  } catch (error) {
    console.error("getCustomers failed", error);
    return { customers: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getCustomersStats(): Promise<CustomersStats> {
  await assertAdmin();
  const now = new Date();
  const rules = await getSegmentRules();

  try {
    const [row] = await db
      .select({
        total: count(),
        ...Object.fromEntries(
          CUSTOMER_SEGMENTS.map((segment) => [
            segment,
            sql<number>`count(*) filter (where ${segmentCondition(segment, rules, now)})`.mapWith(Number),
          ])
        ),
      })
      .from(customers);
    return row as CustomersStats;
  } catch (error) {
    console.error("getCustomersStats failed", error);
    return { total: 0, new: 0, active: 0, loyal: 0, vip: 0, inactive: 0 };
  }
}

export async function getCustomer(id: string): Promise<CustomerDetail | null> {
  await assertAdmin();
  const parsed = customerIdSchema.safeParse(id);
  if (!parsed.success) return null;

  const [row, rules] = await Promise.all([
    db.query.customers.findFirst({ where: eq(customers.id, parsed.data) }),
    getSegmentRules(),
  ]);
  if (!row) return null;

  const [customerOrders, topProducts] = await Promise.all([
    db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        total: orders.total,
        createdAt: orders.createdAt,
        itemsCount:
          sql<number>`(select coalesce(sum(${orderItems.quantity}), 0) from ${orderItems} where ${orderItems.orderId} = ${orders.id})`.mapWith(
            Number
          ),
      })
      .from(orders)
      .where(eq(orders.customerId, row.id))
      .orderBy(desc(orders.createdAt))
      .limit(CUSTOMER_ORDERS_LIMIT),
    db
      .select({
        productName: orderItems.productName,
        productImage: sql<string | null>`max(${orderItems.productImage})`,
        quantity: sql<number>`sum(${orderItems.quantity})`.mapWith(Number),
        ordersCount: sql<number>`count(distinct ${orderItems.orderId})`.mapWith(Number),
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(and(eq(orders.customerId, row.id), ne(orders.status, "cancelled")))
      .groupBy(orderItems.productName)
      .orderBy(desc(sql`sum(${orderItems.quantity})`))
      .limit(CUSTOMER_TOP_PRODUCTS_LIMIT),
  ]);

  const summary = toCustomerSummary(row, rules);
  const delivered = customerOrders.filter((order) => order.status === "delivered");
  return {
    ...summary,
    notes: row.notes,
    average_order: delivered.length > 0 ? summary.total_spent / delivered.length : 0,
    orders: customerOrders.map((order) => ({
      id: order.id,
      order_number: order.orderNumber,
      status: order.status,
      total: Number(order.total),
      items_count: order.itemsCount,
      created_at: order.createdAt.toISOString(),
    })),
    top_products: topProducts.map((product) => ({
      product_name: product.productName,
      product_image: product.productImage,
      quantity: product.quantity,
      orders_count: product.ordersCount,
    })),
  };
}
