import { recipesTable } from "../../../db/schema";
import { db } from "../../../config/drizzle";

import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let recipes;

    if (userId) {
      recipes = await db
        .select()
        .from(recipesTable)
        .where(eq(recipesTable.authorId, userId));
    } else {
      recipes = await db.select().from(recipesTable);
    }

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
