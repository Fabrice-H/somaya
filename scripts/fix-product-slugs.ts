import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

// Load environment variables
config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL not found in .env.local");
  process.exit(1);
}

const sql = neon(connectionString);

/**
 * Generate a URL-friendly slug from a string
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Generate a unique slug by appending a suffix if needed
 */
async function generateUniqueSlug(name: string, excludeId: string): Promise<string> {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 0;

  while (true) {
    const existing = await sql`
      SELECT id FROM products WHERE slug = ${slug} AND id != ${excludeId}
    `;

    if (existing.length === 0) {
      return slug;
    }

    // Generate a new slug with a unique suffix
    counter++;
    const uniqueSuffix = Date.now().toString(36).slice(-4) + counter.toString(36);
    slug = `${baseSlug}-${uniqueSuffix}`;
  }
}

async function fixProductSlugs() {
  console.log("🔧 Fixing product slugs...\n");

  try {
    // Get all products
    const products = await sql`
      SELECT id, name, slug FROM products ORDER BY created_at ASC
    `;

    console.log(`📦 Found ${products.length} products\n`);

    let fixed = 0;
    let skipped = 0;

    for (const product of products) {
      const { id, name, slug } = product;

      // Check if slug is empty, null, or doesn't match the expected format
      const expectedSlug = generateSlug(name);
      const isValidSlug = slug && /^[a-z0-9-]+$/.test(slug) && slug.length > 0;

      if (!isValidSlug || !slug) {
        const newSlug = await generateUniqueSlug(name, id);

        await sql`
          UPDATE products SET slug = ${newSlug}, updated_at = NOW() WHERE id = ${id}
        `;

        console.log(`✅ Fixed: "${name}"`);
        console.log(`   Old slug: "${slug || "(empty)"}"`);
        console.log(`   New slug: "${newSlug}"\n`);
        fixed++;
      } else {
        console.log(`⏭️  Skipped: "${name}" (slug: "${slug}")`);
        skipped++;
      }
    }

    console.log("\n📊 Summary:");
    console.log(`   Fixed: ${fixed}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${products.length}`);

  } catch (error) {
    console.error("❌ Error fixing slugs:", error);
    throw error;
  }
}

async function main() {
  try {
    await fixProductSlugs();
    console.log("\n🎉 Done!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  }
}

main();
