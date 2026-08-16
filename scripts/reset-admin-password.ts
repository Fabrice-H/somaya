/**
 * Script to reset an admin user's password
 *
 * Usage:
 * pnpm tsx scripts/reset-admin-password.ts admin@somaya.ci newpassword
 */

import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

config({ path: ".env.local" });

const SALT_ROUNDS = 12;

async function main() {
  const [email, password] = process.argv.slice(2);

  if (!email || !password) {
    console.log("Usage: pnpm tsx scripts/reset-admin-password.ts EMAIL NEW_PASSWORD");
    console.log("Example: pnpm tsx scripts/reset-admin-password.ts admin@somaya.ci secret123");
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL not found in .env.local");
    process.exit(1);
  }

  const sql = neon(connectionString);

  console.log(`\nResetting password for: ${email}...`);

  // Check if user exists
  const existing = await sql`
    SELECT id FROM admin_users WHERE email = ${email.toLowerCase()}
  `;

  if (existing.length === 0) {
    console.log("User not found!");
    process.exit(1);
  }

  // Hash new password with bcrypt
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Update password
  await sql`
    UPDATE admin_users
    SET password_hash = ${passwordHash}, updated_at = NOW()
    WHERE email = ${email.toLowerCase()}
  `;

  console.log("Password reset successfully!");
  console.log(`\nCredentials:`);
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${password}`);
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
