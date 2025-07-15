import { revokedTokensTable } from "../../../db/schema";
import { db } from "../../../config/drizzle";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiry = new Date(decoded.exp * 1000);

    await db.insert(revokedTokensTable).values({
      token,
      expiredAt: expiry,
    });

    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error.message);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
