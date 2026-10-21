CREATE TABLE "domain_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(60) NOT NULL,
	"aggregate_id" uuid,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "item_id" varchar(200);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "price_lot_id" uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "stock_applied_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "idx_domain_events_type_created" ON "domain_events" USING btree ("type","created_at");--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_price_lot_id_price_lots_id_fk" FOREIGN KEY ("price_lot_id") REFERENCES "public"."price_lots"("id") ON DELETE set null ON UPDATE no action;