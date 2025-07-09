import { db } from "../../../config/drizzle";
import { recipesTable } from "../../../db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const all = await db.select().from(recipesTable);
    if (!all.length) {
      return NextResponse.json({ meals: [] }, { status: 200 });
    }
    const random = all[Math.floor(Math.random() * all.length)];
    return NextResponse.json({ meals: [random] }, { status: 200 });
  } catch (error) {
    console.error("Random error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
