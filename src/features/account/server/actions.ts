"use server";

import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, gte, isNull } from "drizzle-orm";
import { customers, db, orders } from "@/shared/lib/db";
import { normalizePhone } from "@/shared/lib/phone";
import { consumeRateLimit, getClientIp, resetRateLimit } from "@/shared/lib/rate-limit";
import { LOGIN_RATE_LIMIT } from "@/features/auth/constants";
import { signIn, signOut } from "@/features/auth/server/auth";
import { hashPassword, verifyPassword } from "@/features/auth/server/password";
import { emitEvent } from "@/features/events/server/events";
import {
  ACCOUNT_PATH,
  ACCOUNT_PROFILE_PATH,
  CLAIM_MAX_AGE_MS,
  CLAIM_RATE_LIMIT,
  REGISTER_RATE_LIMIT,
} from "../constants";
import { changePasswordSchema, claimOrderSchema, loginFormSchema, profileSchema, registerSchema } from "../schemas";
import type { AccountActionResult, AccountFormState } from "../types";
import { getCustomerSession } from "./session";

const TOO_MANY_ATTEMPTS = "Trop de tentatives. Réessayez dans quelques minutes.";

const fieldErrorsOf = (issues: { path: PropertyKey[]; message: string }[]) =>
  issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = String(issue.path[0] ?? "form");
    acc[key] = [...(acc[key] ?? []), issue.message];
    return acc;
  }, {});

const safeNext = (value: string) => (value.startsWith("/") && !value.startsWith("//") ? value : ACCOUNT_PATH);

const SECRET_FIELDS = new Set(["password", "currentPassword", "newPassword", "confirmPassword"]);

const formValues = (formData: FormData, keys: string[]) =>
  Object.fromEntries(keys.map((key) => [key, String(formData.get(key) ?? "")]));

const keep = (values: Record<string, string>) =>
  Object.fromEntries(Object.entries(values).filter(([key]) => !SECRET_FIELDS.has(key)));

export async function registerAction(_previous: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const values = formValues(formData, ["firstName", "lastName", "phone", "email", "password", "orderNumber", "next"]);
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error.issues), values: keep(values) };

  const ip = await getClientIp();
  if (!consumeRateLimit(`register:${ip}`, REGISTER_RATE_LIMIT))
    return { error: TOO_MANY_ATTEMPTS, values: keep(values) };

  const phone = normalizePhone(parsed.data.phone)!;
  const email = parsed.data.email || null;
  const existing = await db.query.customers.findFirst({ where: eq(customers.phone, phone) });
  if (existing?.passwordHash) {
    return { fieldErrors: { phone: ["Un compte existe déjà avec ce numéro. Connectez-vous."] }, values: keep(values) };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const now = new Date();
  let customerId: string;
  let created = false;

  if (existing) {
    await db
      .update(customers)
      .set({
        passwordHash,
        accountCreatedAt: now,
        email: existing.email ?? email,
        firstName: existing.firstName || parsed.data.firstName,
        lastName: existing.lastName || parsed.data.lastName,
        updatedAt: now,
      })
      .where(eq(customers.id, existing.id));
    customerId = existing.id;
  } else {
    const [row] = await db
      .insert(customers)
      .values({
        phone,
        email,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        passwordHash,
        accountCreatedAt: now,
      })
      .returning({ id: customers.id });
    customerId = row.id;
    created = true;
  }

  if (parsed.data.orderNumber) {
    await db
      .update(orders)
      .set({ claimedAt: now })
      .where(
        and(
          eq(orders.orderNumber, parsed.data.orderNumber),
          eq(orders.customerId, customerId),
          isNull(orders.claimedAt),
          gte(orders.createdAt, new Date(now.getTime() - CLAIM_MAX_AGE_MS))
        )
      );
  }

  if (created) await emitEvent({ type: "customer.created", customerId });

  try {
    await signIn("customer", { phone, password: parsed.data.password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Compte créé, mais la connexion a échoué. Connectez-vous.", values: keep(values) };
    }
    throw error;
  }

  redirect(safeNext(parsed.data.next));
}

export async function customerLoginAction(_previous: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const values = formValues(formData, ["phone", "password", "next"]);
  const parsed = loginFormSchema.safeParse(values);
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error.issues), values: keep(values) };

  const phone = normalizePhone(parsed.data.phone)!;
  const ip = await getClientIp();
  const keys = [`customer-login:ip:${ip}`, `customer-login:phone:${phone}`];
  if (!keys.every((key) => consumeRateLimit(key, LOGIN_RATE_LIMIT))) {
    return { error: TOO_MANY_ATTEMPTS, values: keep(values) };
  }

  try {
    await signIn("customer", { phone, password: parsed.data.password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Numéro ou mot de passe incorrect", values: keep(values) };
    throw error;
  }

  keys.forEach(resetRateLimit);
  redirect(safeNext(parsed.data.next));
}

export async function customerLogoutAction(): Promise<void> {
  await signOut({ redirect: false });
  redirect("/");
}

export async function updateProfileAction(_previous: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const customer = await getCustomerSession();
  if (!customer) return { error: "Session expirée. Reconnectez-vous." };

  const values = formValues(formData, ["firstName", "lastName", "email", "address", "commune"]);
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error.issues), values };

  await db
    .update(customers)
    .set({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
      commune: parsed.data.commune || null,
      updatedAt: new Date(),
    })
    .where(eq(customers.id, customer.id));

  revalidatePath(ACCOUNT_PATH, "layout");
  return { success: "Informations enregistrées" };
}

export async function changePasswordAction(_previous: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const customer = await getCustomerSession();
  if (!customer?.passwordHash) return { error: "Session expirée. Reconnectez-vous." };

  const parsed = changePasswordSchema.safeParse(
    formValues(formData, ["currentPassword", "newPassword", "confirmPassword"])
  );
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error.issues) };

  if (!(await verifyPassword(parsed.data.currentPassword, customer.passwordHash))) {
    return { fieldErrors: { currentPassword: ["Mot de passe actuel incorrect"] } };
  }

  await db
    .update(customers)
    .set({ passwordHash: await hashPassword(parsed.data.newPassword), updatedAt: new Date() })
    .where(eq(customers.id, customer.id));

  revalidatePath(ACCOUNT_PROFILE_PATH);
  return { success: "Mot de passe modifié" };
}

export async function claimOrderAction(input: unknown): Promise<AccountActionResult> {
  const customer = await getCustomerSession();
  if (!customer) return { ok: false, error: "Session expirée. Reconnectez-vous." };

  const parsed = claimOrderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };

  const ip = await getClientIp();
  if (
    !consumeRateLimit(`claim:${customer.id}`, CLAIM_RATE_LIMIT) ||
    !consumeRateLimit(`claim:ip:${ip}`, CLAIM_RATE_LIMIT)
  ) {
    return { ok: false, error: TOO_MANY_ATTEMPTS };
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.orderNumber, parsed.data.orderNumber),
    columns: { id: true, customerId: true, total: true, claimedAt: true },
  });
  const matches = order && order.customerId === customer.id && Math.round(Number(order.total)) === parsed.data.total;
  if (!matches) return { ok: false, error: "Aucune commande ne correspond à ce numéro et à ce montant." };
  if (order.claimedAt) return { ok: true, message: "Cette commande est déjà dans votre espace." };

  await db.update(orders).set({ claimedAt: new Date() }).where(eq(orders.id, order.id));
  revalidatePath(ACCOUNT_PATH, "layout");
  return { ok: true, message: "Commande retrouvée et ajoutée à votre espace." };
}
