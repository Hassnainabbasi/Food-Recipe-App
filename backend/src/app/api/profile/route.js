import { verifyToken } from "../../middleware/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  const result = await verifyToken(req);

  if (result.status !== 200) {
    return NextResponse.json(
      { message: result.message },
      { status: result.status }
    );
  }

  const user = result.user;

  return NextResponse.json({
    message: "Welcome to your protected profile route!",
    user,
  });
}
