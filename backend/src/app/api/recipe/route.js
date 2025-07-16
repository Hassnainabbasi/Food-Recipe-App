import { recipesTable } from "../../db/schema";
import { db } from "../../config/drizzle";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(req) {
  console.log("POST /api/recipes called");
  try {
    const {
      userId,
      title,
      description,
      image,
      category,
      servings,
      cookTime,
      ingredients,
      instructions,
    } = await req.json();

    if (
      !userId ||
      !title ||
      !description ||
      !image ||
      !category ||
      !servings ||
      !cookTime ||
      !ingredients ||
      !instructions
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    const parsedIngredients =
      typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

    if (!Array.isArray(parsedIngredients)) {
      return NextResponse.json(
        { error: "Ingredients must be an array" },
        { status: 400, headers: corsHeaders }
      );
    }

    const inserted = await db
      .insert(recipesTable)
      .values({
        userId,
        title,
        description,
        image,
        category,
        servings,
        cookTime,
        ingredients: parsedIngredients,
        instructions,
      })
      .returning();

    console.log(inserted[0], "data saved");
    return NextResponse.json(inserted[0], {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("DB Insert Error:", error);
    return NextResponse.json(
      {
        error: "Something went wrong",
        detail: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  try {
    const recipes = await db
      .select()
      .from(recipesTable)
      .where(eq(recipesTable.status, "approved"));
    if (!recipes || recipes.length === 0) {
      return NextResponse.json(
        { message: "No recipes available" },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(recipes, {
      status: 200,
      headers: corsHeaders,
      message: "Recipe route working",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
