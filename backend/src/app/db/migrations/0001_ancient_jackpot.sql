CREATE TABLE "recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image" text,
	"ingredients" json NOT NULL,
	"instructions" text,
	"servings" text,
	"cook_time" text,
	"created_at" timestamp DEFAULT now(),
	"user_id" text NOT NULL,
	"category" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_recipe_id_unique" UNIQUE("user_id","recipe_id");