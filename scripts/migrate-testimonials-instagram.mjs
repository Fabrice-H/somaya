import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log("Creating testimonials and instagram_posts tables...");

  // Create testimonials table
  await sql`
    CREATE TABLE IF NOT EXISTS "testimonials" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" varchar(255) NOT NULL,
      "location" varchar(255),
      "image" varchar(500),
      "text" text NOT NULL,
      "rating" integer DEFAULT 5 NOT NULL,
      "is_active" boolean DEFAULT true NOT NULL,
      "sort_order" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL
    )
  `;
  console.log("✓ Created testimonials table");

  // Create index on testimonials
  await sql`
    CREATE INDEX IF NOT EXISTS "idx_testimonials_sort" ON "testimonials" USING btree ("sort_order")
  `;
  console.log("✓ Created testimonials index");

  // Create instagram_posts table
  await sql`
    CREATE TABLE IF NOT EXISTS "instagram_posts" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "image" varchar(500) NOT NULL,
      "post_url" varchar(500),
      "is_active" boolean DEFAULT true NOT NULL,
      "sort_order" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    )
  `;
  console.log("✓ Created instagram_posts table");

  // Create index on instagram_posts
  await sql`
    CREATE INDEX IF NOT EXISTS "idx_instagram_posts_sort" ON "instagram_posts" USING btree ("sort_order")
  `;
  console.log("✓ Created instagram_posts index");

  // Insert default testimonials
  const existingTestimonials = await sql`SELECT COUNT(*) FROM testimonials`;
  if (Number(existingTestimonials[0].count) === 0) {
    await sql`
      INSERT INTO testimonials (name, location, image, text, rating, sort_order) VALUES
      ('Aminata K.', 'Cocody, Abidjan', '/images/so_maya_ci_1718189738_3388743601078025384_13316418128.jpg', 'J''ai découvert SO''MAYA sur Instagram et j''ai tout de suite été séduite par la qualité des bijoux. Le service client est exceptionnel, très réactif sur WhatsApp. Je recommande vivement !', 5, 0),
      ('Fatou D.', 'Plateau, Abidjan', '/images/so_maya_ci_1741723913_3586162563608962394_13316418128.jpg', 'Mes boubous préférés viennent tous de SO''MAYA. La qualité des tissus et les finitions sont impeccables. C''est devenu ma boutique de référence pour les grandes occasions.', 5, 1),
      ('Mariam T.', 'Marcory, Abidjan', '/images/so_maya_ci_1763665764_3770224151630499569_13316418128.jpg', 'Le sac que j''ai commandé est encore plus beau en vrai qu''en photo. La livraison a été rapide et le packaging très soigné. Une vraie expérience premium.', 5, 2)
    `;
    console.log("✓ Inserted default testimonials");
  }

  // Insert default instagram posts
  const existingPosts = await sql`SELECT COUNT(*) FROM instagram_posts`;
  if (Number(existingPosts[0].count) === 0) {
    await sql`
      INSERT INTO instagram_posts (image, sort_order) VALUES
      ('/images/so_maya_ci_1776781082_3880233341219782649_13316418128.jpg', 0),
      ('/images/so_maya_ci_1763665764_3770224151630499569_13316418128.jpg', 1),
      ('/images/so_maya_ci_1764407987_3776450373553282721_13316418128.jpg', 2),
      ('/images/so_maya_ci_1762182114_3757778391685137651_13316418128.jpg', 3),
      ('/images/so_maya_ci_1718189738_3388743601078025384_13316418128.jpg', 4),
      ('/images/so_maya_ci_1741723913_3586162563608962394_13316418128.jpg', 5)
    `;
    console.log("✓ Inserted default instagram posts");
  }

  // Create hero_banner table
  await sql`
    CREATE TABLE IF NOT EXISTS "hero_banner" (
      "id" uuid PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000003' NOT NULL,
      "layout" varchar(50) DEFAULT 'split' NOT NULL,
      "eyebrow" varchar(100) DEFAULT 'Maison de mode · Abidjan',
      "title" varchar(255) DEFAULT 'L''élégance',
      "title_highlight" varchar(100) DEFAULT 'commence',
      "title_suffix" varchar(100) DEFAULT 'ici.',
      "description" text DEFAULT 'Des pièces sélectionnées pour accompagner chaque femme et chaque homme au quotidien.',
      "button_text" varchar(100) DEFAULT 'Découvrir la collection',
      "button_link" varchar(255) DEFAULT '#collections',
      "media_type" varchar(20) DEFAULT 'video' NOT NULL,
      "media_url" varchar(500) DEFAULT '/ca34b0bbe4d6416f8820cdb2c9267efc.MOV',
      "media_position" varchar(50) DEFAULT 'center 22%',
      "background_color" varchar(50) DEFAULT '#511F29',
      "text_color" varchar(50) DEFAULT '#fbf3ec',
      "accent_color" varchar(50) DEFAULT '#fcd3b4',
      "is_active" boolean DEFAULT true NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL
    )
  `;
  console.log("✓ Created hero_banner table");

  // Insert default hero banner
  const existingHero = await sql`SELECT COUNT(*) FROM hero_banner`;
  if (Number(existingHero[0].count) === 0) {
    await sql`
      INSERT INTO hero_banner (id) VALUES ('00000000-0000-0000-0000-000000000003')
    `;
    console.log("✓ Inserted default hero banner");
  }

  console.log("Migration complete!");
}

migrate().catch(console.error);
