import { db } from "../../../../config/drizzle";
import { favoritesTable } from "../../../../db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(req, { params }) {
  const { userId, recipeId } = params;

  try {
    await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, parseInt(recipeId))
        )
      );

    return Response.json({ message: "Recipe removed from favorites" });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
