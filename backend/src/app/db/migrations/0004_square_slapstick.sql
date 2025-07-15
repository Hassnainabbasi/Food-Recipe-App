CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "title_json" jsonb;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "description_json" jsonb;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "instructions_json" jsonb;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "category_json" jsonb;