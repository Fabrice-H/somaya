CREATE TABLE "featured_collection" (
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
);
--> statement-breakpoint
ALTER TABLE "featured_collection" ADD CONSTRAINT "featured_collection_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;