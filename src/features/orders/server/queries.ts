import "server-only";
import { and, count, desc, eq, gte, ilike, lt, or, type SQL } from "drizzle-orm";
import { db, orders } from "@/shared/lib/db";
import { assertAdmin } from "@/features/auth/server/session";
import { EMPTY_ORDERS_STATS, ORDERS_PAGE_SIZE } from "../constants";
import { orderIdSchema } from "../schemas";
import { escapeLikePattern } from "../utils";
import { toOrderDetail, toOrderSummary } from "./mappers";
import type { OrderDetail, OrdersFilter, OrdersStats, PaginatedOrders } from "../types";

function buildOrdersWhere({ status, search, dateFrom, dateTo }: OrdersFilter): SQL | undefined {
  const conditions: (SQL | undefined)[] = [];

  if (status !== "all") conditions.push(eq(orders.status, status));

  if (search) {
    const term = `%${escapeLikePattern(search)}%`;
    conditions.push(
      or(
        ilike(orders.orderNumber, term),
        ilike(orders.customerFirstName, term),
        ilike(orders.customerLastName, term),
        ilike(orders.customerPhone, term)
      )
    );
  }

  if (dateFrom) conditions.push(gte(orders.createdAt, new Date(dateFrom)));

  if (dateTo) {
    const end = new Date(dateTo);
    end.setDate(end.getDate() + 1);
    conditions.push(lt(orders.createdAt, end));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

export async function getOrders(filter: OrdersFilter): Promise<PaginatedOrders> {
  await assertAdmin();

  const where = buildOrdersWhere(filter);

  try {
    const [[{ total }], rows] = await Promise.all([
      db.select({ total: count() }).from(orders).where(where),
      db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          status: orders.status,
          customerFirstName: orders.customerFirstName,
          customerLastName: orders.customerLastName,
          customerPhone: orders.customerPhone,
          paymentMethod: orders.paymentMethod,
          paymentStatus: orders.paymentStatus,
          orderChannel: orders.orderChannel,
          total: orders.total,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .where(where)
        .orderBy(desc(orders.createdAt))
        .limit(ORDERS_PAGE_SIZE)
        .offset((filter.page - 1) * ORDERS_PAGE_SIZE),
    ]);

    return {
      orders: rows.map(toOrderSummary),
      total,
      page: filter.page,
      totalPages: Math.ceil(total / ORDERS_PAGE_SIZE),
    };
  } catch (error) {
    console.error("getOrders failed", error);
    return { orders: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getOrdersStats(): Promise<OrdersStats> {
  await assertAdmin();

  try {
    const rows = await db.select({ status: orders.status, count: count() }).from(orders).groupBy(orders.status);

    return rows.reduce<OrdersStats>(
      (stats, row) => ({ ...stats, [row.status]: row.count, total: stats.total + row.count }),
      { ...EMPTY_ORDERS_STATS }
    );
  } catch (error) {
    console.error("getOrdersStats failed", error);
    return { ...EMPTY_ORDERS_STATS };
  }
}

export async function getOrder(id: string): Promise<OrderDetail | null> {
  await assertAdmin();

  const parsed = orderIdSchema.safeParse(id);
  if (!parsed.success) return null;

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, parsed.data),
    with: { items: true, payments: { orderBy: (payment, { desc: descending }) => [descending(payment.createdAt)] } },
  });

  return order ? toOrderDetail(order) : null;
}
