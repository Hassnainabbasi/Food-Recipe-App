import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    const recipes = await db.select().from(recipesTable);
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
