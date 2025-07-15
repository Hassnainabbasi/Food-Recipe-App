ALTER TABLE "users" ADD COLUMN "verificationCode" varchar(6);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "isVerified" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "code";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_verified";