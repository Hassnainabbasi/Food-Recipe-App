import { usersTable } from "../../../db/schema";
import { db } from "../../../config/drizzle";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "../../../../../lib/sendEmail";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log(email, password);
    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const code = generateCode();
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email));

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(usersTable)
      .values({
        email,
        password: hashPassword,
        verificationCode: code,
        isVerified: 0,
      })
      .returning();
    console.log(`Verification code for ${email}: ${code}`);
    await sendVerificationEmail(email, code);

    return NextResponse.json(inserted[0], {
      message: "Verification code sent to email",
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500, headers: corsHeaders }
    );
  }
}
