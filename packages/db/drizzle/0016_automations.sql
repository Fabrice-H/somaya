CREATE TABLE "automation_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"automation_key" varchar(60) NOT NULL,
	"event_type" varchar(60) NOT NULL,
	"aggregate_id" uuid,
	"status" varchar(20) NOT NULL,
	"message" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "automation_settings" (
	"key" varchar(60) PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "inactive_notified_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "idx_automation_runs_created" ON "automation_runs" USING btree ("created_at");