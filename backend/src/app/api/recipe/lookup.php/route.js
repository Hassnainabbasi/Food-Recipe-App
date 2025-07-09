import { db } from "../../../config/drizzle";
import { recipesTable } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("i");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const result = await db
      .select()
      .from(recipesTable)
      .where(eq(recipesTable.id, parseInt(id)))
      .limit(1);

    return NextResponse.json({ meals: result }, { status: 200 });
  } catch (error) {
    console.error("Lookup error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
