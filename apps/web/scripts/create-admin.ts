import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

config({ path: ".env.local" });

const SALT_ROUNDS = 12;

async function main() {
  const [email, password, name] = process.argv.slice(2);

  if (!email || !password || !name) {
    console.log("Usage: pnpm tsx scripts/create-admin.ts EMAIL PASSWORD NAME");
    console.log('Example: pnpm tsx scripts/create-admin.ts admin@somaya.ci MOT_DE_PASSE_FORT "Admin SOMAYA"');
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL not found in .env.local");
    process.exit(1);
  }

  const sql = neon(connectionString);

  console.log(`\nCreating admin user: ${email}...`);

  const existing = await sql`
    SELECT id FROM admin_users WHERE email = ${email.toLowerCase()}
  `;

  if (existing.length > 0) {
    console.log("⚠️  User already exists!");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await sql`
    INSERT INTO admin_users (email, password_hash, name, is_active)
    VALUES (${email.toLowerCase()}, ${passwordHash}, ${name}, true)
  `;

  console.log("✅ Admin user created successfully!");
  console.log(`\nCredentials:`);
  console.log(`  Email: ${email}`);
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
