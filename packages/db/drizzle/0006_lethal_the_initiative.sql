CREATE TABLE "price_lots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"category_id" uuid,
	"items" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "price_lots" ADD CONSTRAINT "price_lots_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_price_lots_category" ON "price_lots" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_price_lots_price" ON "price_lots" USING btree ("price");--> statement-breakpoint
CREATE INDEX "idx_price_lots_active" ON "price_lots" USING btree ("is_active");