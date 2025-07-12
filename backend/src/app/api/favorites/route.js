import { db } from "../../config/drizzle";
import { favoritesTable } from "../../db/schema";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const { userId, recipeId, title, image, servings, cookTime } =
      await req.json();

    if (!userId || !recipeId || !title || !image || !servings || !cookTime) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    const inserted = await db
      .insert(favoritesTable)
      .values({ userId, recipeId, title, image, servings, cookTime })
      .returning();

    return NextResponse.json(inserted[0], {
      status: 201,
      headers: corsHeaders,
    });
  } catch (e) {
    if (e.message.includes("duplicate") || e.message.includes("unique")) {
      return NextResponse.json(
        { error: "Recipe already favorited" },
        { status: 409, headers: corsHeaders }
      );
    }
    console.error(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500, headers: corsHeaders }
    );
  }
}
