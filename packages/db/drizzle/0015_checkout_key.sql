ALTER TABLE "orders" ADD COLUMN "checkout_key" varchar(64);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_checkout_key_unique" UNIQUE("checkout_key");