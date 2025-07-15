import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(request) {
  const body = await request.json();
  return (
    NextResponse.json({}, { status: 201, headers: corsHeaders, body: body }),
    {
      status: 201,
    }
  );
}
