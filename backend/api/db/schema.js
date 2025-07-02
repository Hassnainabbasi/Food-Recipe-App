import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const favoritesTable = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  recipeId: integer("recipe_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  title: text("title").notNull(),
  image: text("image"),
  servings: text("servings"),
  cookTime: text("cook_time"),
});
