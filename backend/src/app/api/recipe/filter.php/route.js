import { db } from "../../../config/drizzle";
import { recipesTable } from "../../../db/schema";
import { ilike } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ingredient = searchParams.get("i");
  const category = searchParams.get("c");

  try {
    let results = [];

    if (ingredient) {
      results = await db
        .select()
        .from(recipesTable)
        .where(ilike(recipesTable.ingredients, `%${ingredient}%`));
    } else if (category) {
      results = await db
        .select()
        .from(recipesTable)
        .where(ilike(recipesTable.category, `%${category}%`));
    } else {
      return NextResponse.json(
        { error: "Missing query parameter" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { meals: results },
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
    console.error("Filter error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
