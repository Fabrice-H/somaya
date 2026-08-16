import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log("Creating featured_collection table...");

  try {
    // Create table
    await sql`
      CREATE TABLE IF NOT EXISTS "featured_collection" (
        "id" uuid PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000002' NOT NULL,
        "eyebrow" varchar(100) DEFAULT 'La nouvelle saison',
        "title" varchar(255) DEFAULT 'Collection Cérémonie 2026',
        "description" text,
        "stat1_value" varchar(50),
        "stat1_label" varchar(100),
        "stat2_value" varchar(50),
        "stat2_label" varchar(100),
        "button_text" varchar(100) DEFAULT 'Voir la collection',
        "button_link" varchar(255) DEFAULT '/catalogue',
        "images" jsonb DEFAULT '[]'::jsonb,
        "category_id" uuid,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      )
    `;

    console.log("Table created successfully!");

    // Add foreign key if not exists
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'featured_collection_category_id_categories_id_fk'
        ) THEN
          ALTER TABLE "featured_collection"
          ADD CONSTRAINT "featured_collection_category_id_categories_id_fk"
          FOREIGN KEY ("category_id")
          REFERENCES "public"."categories"("id")
          ON DELETE set null ON UPDATE no action;
        END IF;
      END
      $$
    `;

    console.log("Foreign key added!");

    // Insert default row if not exists
    const existing = await sql`SELECT id FROM featured_collection WHERE id = '00000000-0000-0000-0000-000000000002'`;

    if (existing.length === 0) {
      await sql`
        INSERT INTO featured_collection (
          id, eyebrow, title, description,
          stat1_value, stat1_label, stat2_value, stat2_label,
          button_text, button_link, images, is_active
        ) VALUES (
          '00000000-0000-0000-0000-000000000002',
          'La nouvelle saison',
          'Collection Cérémonie 2026',
          'Boubous d''exception, satins profonds et broderies dorées. Une garde-robe pensée pour les grandes occasions comme pour l''éclat du quotidien.',
          '48', 'Nouvelles pièces',
          '100%', 'Fait main',
          'Voir la collection', '/catalogue',
          '[]'::jsonb,
          true
        )
      `;
      console.log("Default row inserted!");
    } else {
      console.log("Default row already exists.");
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
