ALTER TABLE "domain_events" ADD COLUMN "dispatched_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "idx_domain_events_dispatched" ON "domain_events" USING btree ("dispatched_at","created_at");--> statement-breakpoint
UPDATE "domain_events" SET "dispatched_at" = now() WHERE "dispatched_at" IS NULL;