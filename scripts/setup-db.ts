import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

// Load environment variables
config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL not found in .env.local");
  process.exit(1);
}

const sql = neon(connectionString);

async function runMigration() {
  console.log("🚀 Starting database setup...\n");

  // Read migration file
  const migrationPath = path.join(__dirname, "../drizzle/0000_robust_maddog.sql");
  const migrationContent = fs.readFileSync(migrationPath, "utf-8");

  // Split by statement breakpoint and execute each statement
  const statements = migrationContent
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`📝 Found ${statements.length} statements to execute\n`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const preview = statement.substring(0, 60).replace(/\n/g, " ");

    try {
      await sql.query(statement);
      console.log(`✅ [${i + 1}/${statements.length}] ${preview}...`);
    } catch (error: unknown) {
      const err = error as Error & { code?: string };
      // Ignore "already exists" errors
      if (err.code === "42710" || err.code === "42P07" || err.message?.includes("already exists")) {
        console.log(`⏭️  [${i + 1}/${statements.length}] Already exists, skipping...`);
      } else {
        console.error(`❌ [${i + 1}/${statements.length}] Error:`, err.message);
        throw error;
      }
    }
  }

  console.log("\n✅ Migration completed successfully!");
}

async function createInitialAdmin() {
  console.log("\n👤 Creating initial admin user...\n");

  const adminEmail = "admin@somaya.ci";
  const adminPassword = "Admin123!";
  const adminName = "Administrateur";

  try {
    // Check if admin already exists
    const existing = await sql`
      SELECT id FROM admin_users WHERE email = ${adminEmail}
    `;

    if (existing.length > 0) {
      console.log("⏭️  Admin user already exists, skipping...");
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

    // Create admin user
    await sql`
      INSERT INTO admin_users (email, password_hash, name, is_active)
      VALUES (${adminEmail}, ${passwordHash}, ${adminName}, true)
    `;

    console.log("✅ Admin user created successfully!");
    console.log("\n📋 Credentials:");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("\n⚠️  Please change the password after first login!");
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Error creating admin:", err.message);
    throw error;
  }
}

async function createDefaultSettings() {
  console.log("\n⚙️  Creating default store settings...\n");

  try {
    const existing = await sql`
      SELECT id FROM store_settings WHERE id = '00000000-0000-0000-0000-000000000001'
    `;

    if (existing.length > 0) {
      console.log("⏭️  Store settings already exist, skipping...");
      return;
    }

    await sql`
      INSERT INTO store_settings (
        id,
        store_name,
        tagline,
        whatsapp_number,
        delivery_fee,
        primary_color,
        secondary_color
      )
      VALUES (
        '00000000-0000-0000-0000-000000000001',
        'SO''MAYA',
        'Maison de Mode - Abidjan',
        '+225 0700000000',
        '2000',
        '#511F29',
        '#fcd3b4'
      )
    `;

    console.log("✅ Default store settings created!");
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Error creating settings:", err.message);
    throw error;
  }
}

async function main() {
  try {
    await runMigration();
    await createInitialAdmin();
    await createDefaultSettings();

    console.log("\n🎉 Database setup complete!\n");
    console.log("You can now run: pnpm dev");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Setup failed:", error);
    process.exit(1);
  }
}

main();
