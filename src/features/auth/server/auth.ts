import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { adminUsers, db } from "@/shared/lib/db";
import { loginSchema } from "../schemas";
import { verifyPassword } from "./password";

const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;
const TIMING_SAFE_HASH = "$2b$12$gx7Qd7bGsax/KB.1tqfNNuNTZFRXJmW/U8KoLMZl.SwmvOtjZWb3m";

async function authorizeAdmin(credentials: unknown) {
  const parsed = loginSchema.safeParse(credentials);
  if (!parsed.success) return null;

  const admin = await db.query.adminUsers.findFirst({ where: eq(adminUsers.email, parsed.data.email) });
  const valid = await verifyPassword(parsed.data.password, admin?.passwordHash ?? TIMING_SAFE_HASH);
  if (!admin?.isActive || !valid) return null;

  await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, admin.id));
  return { id: admin.id, email: admin.email, name: admin.name ?? "" };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          return await authorizeAdmin(credentials);
        } catch (error) {
          console.error("Admin authorization failed", error);
          return null;
        }
      },
    }),
  ],
  pages: { signIn: "/" },
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SECONDS },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id as string;
      return session;
    },
  },
  trustHost: true,
});
