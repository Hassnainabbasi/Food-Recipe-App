import { db } from "../../config/drizzle";
import { revokedTokensTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function verifyToken(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { status: 401, message: "No token provided" };
  }

  const token = authHeader.split(" ")[1];

  const revoked = await db
    .select()
    .from(revokedTokensTable)
    .where(eq(revokedTokensTable.token, token));

  if (revoked.length > 0) {
    return { status: 401, message: "Token is revoked" };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { status: 200, user: decoded };
  } catch (err) {
    return { status: 401, message: "Invalid token" };
  }
}
