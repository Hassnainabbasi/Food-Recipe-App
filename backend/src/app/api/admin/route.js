import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST() {
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
  } catch (error) {}
}
