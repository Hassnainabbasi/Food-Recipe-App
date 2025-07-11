import { db } from "../../../config/drizzle";
import { recipesTable } from "../../../db/schema";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const recipes = await db.select().from(recipesTable);
    const categoryMap = new Map();

    for (const recipe of recipes) {
      if (!categoryMap.has(recipe.category)) {
        categoryMap.set(recipe.category, {
          category: recipe.category,
          image: recipe.image,
        });
      }
    }
    const categoriesValue = Array.from(categoryMap.values());
    return NextResponse.json(
      { categories: categoriesValue },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
