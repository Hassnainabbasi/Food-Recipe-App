ALTER TABLE "recipes" ALTER COLUMN "ingredients" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "category" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;