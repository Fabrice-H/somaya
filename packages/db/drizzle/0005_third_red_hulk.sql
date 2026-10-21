CREATE TABLE "hero_banner" (
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
);
--> statement-breakpoint
ALTER TABLE "product_lots" ADD COLUMN "items" jsonb DEFAULT '[]'::jsonb;