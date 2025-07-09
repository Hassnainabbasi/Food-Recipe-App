import { db } from "../../../config/drizzle";
import { recipesTable } from "../../../db/schema";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const recipes = await db.select().from(recipesTable);

    const uniqueCategories = [...new Set(recipes.map((r) => r.category))];

    return NextResponse.json({ categories: uniqueCategories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
