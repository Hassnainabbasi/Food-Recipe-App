import { eq } from "drizzle-orm";
import { db } from "../../../config/drizzle";
import { recipesTable } from "../../../db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const all = await db
      .select()
      .from(recipesTable)
      .where(eq(recipesTable.status, "approved"));

    if (!all.length) {
      return NextResponse.json({ meals: [] }, { status: 200 });
    }
    const random = all[Math.floor(Math.random() * all.length)];
    return NextResponse.json(
      { meals: [random] },
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
    console.error("Random error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
