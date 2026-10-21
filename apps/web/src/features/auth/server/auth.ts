import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { adminUsers, customers, db } from "@/shared/lib/db";
import { normalizePhone } from "@/shared/lib/phone";
import { verifyGuestToken } from "@/features/account/server/guest-token";
import { SESSION_MAX_AGE_SECONDS } from "../constants";
import { customerLoginSchema, guestLoginSchema, loginSchema } from "../schemas";
import { TIMING_SAFE_HASH, verifyPassword } from "./password";

async function authorizeAdmin(credentials: unknown) {
  const parsed = loginSchema.safeParse(credentials);
  if (!parsed.success) return null;

  const admin = await db.query.adminUsers.findFirst({ where: eq(adminUsers.email, parsed.data.email) });
  const valid = await verifyPassword(parsed.data.password, admin?.passwordHash ?? TIMING_SAFE_HASH);
  if (!admin?.isActive || !valid) return null;

  await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, admin.id));
  return { id: admin.id, email: admin.email, name: admin.name ?? "", role: "admin" as const };
}

async function authorizeCustomer(credentials: unknown) {
  const parsed = customerLoginSchema.safeParse(credentials);
  if (!parsed.success) return null;
  const phone = normalizePhone(parsed.data.phone);
  if (!phone) return null;

  const customer = await db.query.customers.findFirst({ where: eq(customers.phone, phone) });
  const valid = await verifyPassword(parsed.data.password, customer?.passwordHash ?? TIMING_SAFE_HASH);
  if (!customer?.passwordHash || !valid) return null;

  await db.update(customers).set({ lastLoginAt: new Date() }).where(eq(customers.id, customer.id));
  return { id: customer.id, email: customer.email, name: customer.firstName, role: "customer" as const, guest: false };
}

async function authorizeGuest(credentials: unknown) {
  const parsed = guestLoginSchema.safeParse(credentials);
  if (!parsed.success) return null;
  const phone = normalizePhone(parsed.data.phone);
  if (!phone || !(await verifyGuestToken(phone, parsed.data.token))) return null;

  const customer = await db.query.customers.findFirst({ where: eq(customers.phone, phone) });
  if (!customer || customer.passwordHash) return null;

  await db.update(customers).set({ lastLoginAt: new Date() }).where(eq(customers.id, customer.id));
  return { id: customer.id, email: customer.email, name: customer.firstName, role: "customer" as const, guest: true };
}

const safely =
  <T>(label: string, run: (credentials: unknown) => Promise<T | null>) =>
  async (credentials: unknown) => {
    try {
      return await run(credentials);
    } catch (error) {
      console.error(`${label} authorization failed`, error);
      return null;
    }
  };

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Administration",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: safely("Admin", authorizeAdmin),
    }),
    Credentials({
      id: "customer",
      name: "Espace client",
      credentials: {
        phone: { label: "Téléphone", type: "tel" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: safely("Customer", authorizeCustomer),
    }),
    Credentials({
      id: "guest",
      name: "Invité",
      credentials: {
        phone: { label: "Téléphone", type: "tel" },
        token: { label: "Jeton", type: "text" },
      },
      authorize: safely("Guest", authorizeGuest),
    }),
  ],
  pages: { signIn: "/" },
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SECONDS },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.guest = user.guest ?? false;
        token.issuedAt = Date.now();
      }
      if (trigger === "update" && token.role === "customer" && token.id) {
        const customer = await db.query.customers.findFirst({
          where: eq(customers.id, token.id),
          columns: { passwordHash: true, firstName: true },
        });
        token.guest = !customer?.passwordHash;
        token.name = customer?.firstName || token.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id && token.role) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.guest = token.guest ?? false;
        session.user.issuedAt = token.issuedAt ?? 0;
      }
      return session;
    },
  },
  trustHost: true,
});
