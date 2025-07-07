import { db } from "../../../config/drizzle";
import { favoritesTable } from "../../../db/schema";
import { eq } from "drizzle-orm";

export async function GET(req, { params }) {
  const { userId } = params;

  try {
    const favorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));

    return Response.json(favorites);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
