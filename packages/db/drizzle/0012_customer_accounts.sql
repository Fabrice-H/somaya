ALTER TABLE "customers" ADD COLUMN "password_hash" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "account_created_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "last_login_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "commune" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "claimed_at" timestamp with time zone;