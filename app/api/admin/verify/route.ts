import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { pin } = await req.json();

  if (!process.env.ADMIN_PIN) {
    return NextResponse.json(
      { error: "ADMIN_PIN belum diset di environment variables" },
      { status: 500 }
    );
  }

  if (pin === process.env.ADMIN_PIN) {
    return NextResponse.json({ valid: true });
  }

  return NextResponse.json({ valid: false }, { status: 401 });
}