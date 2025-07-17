import { db } from "../../../config/drizzle";
import { recipesTable } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  const { id, status } = await req.json();

  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    await db
      .update(recipesTable)
      .set({ status })
      .where(eq(recipesTable.id, id));

    return NextResponse.json({ message: `Recipe ${status}` });
  } catch (error) {
    console.log(error.message, "error");
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
