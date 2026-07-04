import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { id, pin } = await req.json();

    if (!id || !pin) {
      return NextResponse.json(
        { error: "id dan pin wajib diisi" },
        { status: 400 }
      );
    }

    if (pin !== process.env.ADMIN_PIN) {
      return NextResponse.json({ error: "PIN salah" }, { status: 401 });
    }

    const { error } = await supabaseAdmin.from("moments").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: "Gagal menghapus foto" },
      { status: 500 }
    );
  }
}