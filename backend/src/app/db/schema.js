import { json } from "drizzle-orm/gel-core";
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  unique,
  jsonb,
} from "drizzle-orm/pg-core";

export const favoritesTable = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    recipeId: integer("recipe_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    title: text("title").notNull(),
    image: text("image"),
    servings: text("servings"),
    cookTime: text("cook_time"),
  },
  (table) => {
    return {
      uniqueUserRecipe: unique().on(table.userId, table.recipeId),
    };
  }
);

export const recipesTable = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  title_json: jsonb("title_json"),
  description: text("description"),
  description_json: jsonb("description_json"),
  image: text("image"),
  ingredients: jsonb("ingredients").notNull(),
  instructions_json: jsonb("instructions_json"),
  instructions: text("instructions"),
  servings: text("servings"),
  cookTime: text("cook_time"),
  createdAt: timestamp("created_at").defaultNow(),
  userId: text("user_id").notNull(),
  category: text("category").notNull(),
  category_json: jsonb("category_json"),
  status: text("status").default("pending").notNull(),
});
