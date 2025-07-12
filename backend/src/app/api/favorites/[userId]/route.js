import { NextResponse } from "next/server";
import { db } from "../../../config/drizzle";
import { favoritesTable } from "../../../db/schema";
import { eq } from "drizzle-orm";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(req, { params }) {
  const { userId } = params;

  try {
    const favorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));

    return NextResponse.json(
      { favorites: favorites },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500, headers: corsHeaders }
    );
  }
}
