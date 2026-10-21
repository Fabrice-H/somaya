CREATE TABLE "whatsapp_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wa_id" varchar(32) NOT NULL,
	"phone" varchar(20),
	"profile_name" varchar(255),
	"customer_id" uuid,
	"mode" varchar(10) DEFAULT 'auto' NOT NULL,
	"status" varchar(10) DEFAULT 'open' NOT NULL,
	"unread_count" integer DEFAULT 0 NOT NULL,
	"last_inbound_at" timestamp with time zone,
	"last_message_at" timestamp with time zone,
	"last_auto_reply_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "whatsapp_conversations_wa_id_unique" UNIQUE("wa_id")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"wa_message_id" varchar(255),
	"direction" varchar(10) NOT NULL,
	"type" varchar(30) NOT NULL,
	"body" text,
	"media_url" varchar(1000),
	"author" varchar(20) DEFAULT 'customer' NOT NULL,
	"status" varchar(20) DEFAULT 'received' NOT NULL,
	"raw" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "whatsapp_messages_wa_message_id_unique" UNIQUE("wa_message_id")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_settings" (
	"id" uuid PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000005' NOT NULL,
	"auto_reply_enabled" boolean DEFAULT true NOT NULL,
	"hours_start" integer DEFAULT 9 NOT NULL,
	"hours_end" integer DEFAULT 19 NOT NULL,
	"welcome_message" text,
	"away_message" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "whatsapp_conversations" ADD CONSTRAINT "whatsapp_conversations_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_conversation_id_whatsapp_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."whatsapp_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_whatsapp_conversations_last" ON "whatsapp_conversations" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "idx_whatsapp_messages_conversation" ON "whatsapp_messages" USING btree ("conversation_id","created_at");