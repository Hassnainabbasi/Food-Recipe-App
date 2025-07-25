import { db } from "../../../config/drizzle";
import { recipesTable } from "../../../db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(req) {
  console.log("Request received");
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("i");
  console.log(id,'id')
  if (!id) {
    return NextResponse.json(
      { error: "Missing ID" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const result = await db
      .select()
      .from(recipesTable)
      .where(and(eq(recipesTable.id, id), eq(recipesTable.status, "approved")))
      .limit(1);

    return NextResponse.json(
      { meals: result },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Lookup error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
