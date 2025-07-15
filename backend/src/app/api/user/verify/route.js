import { usersTable } from "../../../db/schema";
import { db } from "../../../config/drizzle";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const { email, code } = await req.json();
    console.log(code, email, "request");

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    const user = users[0];
    if (!user || user.verificationCode !== code) {
      return NextResponse.json({ message: "Invalid code" }, { status: 400 });
    }
    await db
      .update(usersTable)
      .set({ isVerified: 1, verificationCode: null })
      .where(eq(usersTable.email, email));

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return NextResponse.json({ message: "Verified successfully", token });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 }
    );
  }
}
