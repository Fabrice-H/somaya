import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { adminUsers, db } from "@/shared/lib/db";
import { loginSchema } from "../schemas";
import { verifyPassword } from "./password";

const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;

async function authorizeAdmin(credentials: unknown) {
  const parsed = loginSchema.safeParse(credentials);
  if (!parsed.success) return null;

  const admin = await db.query.adminUsers.findFirst({ where: eq(adminUsers.email, parsed.data.email) });
  if (!admin?.isActive) return null;
  if (!(await verifyPassword(parsed.data.password, admin.passwordHash))) return null;

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
  pages: { signIn: "/admin/login" },
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
