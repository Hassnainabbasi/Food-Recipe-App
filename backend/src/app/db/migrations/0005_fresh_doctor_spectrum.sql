ALTER TABLE "users" ADD COLUMN "code" varchar(6);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_verified" integer DEFAULT 0;