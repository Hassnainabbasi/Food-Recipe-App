import { recipesTable } from "../../../db/schema";
import { db } from "../../../config/drizzle";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const { id, status } = await req.json();

    if (!id || !["approved", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid request. 'id' and valid 'status' are required." },
        { status: 400 }
      );
    }

    const result = await db
      .update(recipesTable)
      .set({ status })
      .where(eq(recipesTable.id, id))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Status updated", recipe: result[0] }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Status Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update status", detail: error.message },
      { status: 500 }
    );
  }
}
