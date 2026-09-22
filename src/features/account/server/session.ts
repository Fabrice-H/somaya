import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { customers, db } from "@/shared/lib/db";
import type { Customer } from "@/shared/lib/db/schema";
import { getSessionIdentity } from "@/features/auth/server/session";
import { ACCOUNT_LOGIN_PATH } from "../constants";

export const getCustomerSession = cache(async (): Promise<Customer | null> => {
  const identity = await getSessionIdentity();
  if (!identity || identity.role !== "customer") return null;
  const customer = await db.query.customers.findFirst({ where: eq(customers.id, identity.id) });
  return customer?.passwordHash ? customer : null;
});

export async function requireCustomer(next?: string): Promise<Customer> {
  const customer = await getCustomerSession();
  if (!customer) redirect(next ? `${ACCOUNT_LOGIN_PATH}?next=${encodeURIComponent(next)}` : ACCOUNT_LOGIN_PATH);
  return customer;
}
