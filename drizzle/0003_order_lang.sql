ALTER TABLE "orders" ADD COLUMN "lang" text DEFAULT 'en' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "withdrawal_waiver" text;