import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db, adminUsers } from "@/lib/db";
import { eq } from "drizzle-orm";
import { verifyPassword } from "./password";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        try {
          console.log("[Auth] Attempting login for:", email.toLowerCase());

          // Find admin user by email
          const admin = await db.query.adminUsers.findFirst({
            where: eq(adminUsers.email, email.toLowerCase()),
          });

          console.log("[Auth] User found:", !!admin);

          if (!admin || !admin.isActive) {
            console.log("[Auth] User not found or inactive");
            return null;
          }

          console.log("[Auth] User is active, verifying password...");

          // Verify password
          const isValid = await verifyPassword(password, admin.passwordHash);
          console.log("[Auth] Password valid:", isValid);

          if (!isValid) {
            return null;
          }

          // Update last login
          await db
            .update(adminUsers)
            .set({ lastLoginAt: new Date() })
            .where(eq(adminUsers.id, admin.id));

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name || "",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  trustHost: true,
});
