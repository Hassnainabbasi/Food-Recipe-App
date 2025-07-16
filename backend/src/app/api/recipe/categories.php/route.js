import { db } from "../../../config/drizzle";
import { recipesTable } from "../../../db/schema";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  try {
    const recipes = await db
      .select()
      .from(recipesTable)
      .where(eq(recipesTable.status, "approved"));

    const categoryMap = new Map();

    for (const recipe of recipes) {
      if (!categoryMap.has(recipe.category)) {
        categoryMap.set(recipe.category, {
          category: recipe.category,
          image: recipe.image,
          category_json: recipe.category_json,
        });
      }
    }
    const categoriesValue = Array.from(categoryMap.values());
    return NextResponse.json(
      { categories: categoriesValue },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500, headers: corsHeaders }
    );
  }
}
