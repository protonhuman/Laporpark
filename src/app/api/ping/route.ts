import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Lakukan query yang sangat ringan (hanya mengambil 1 ID dari tabel users)
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Ping Error:", error.message);
      return NextResponse.json(
        { status: "error", message: "Gagal terhubung ke database", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        status: "ok", 
        message: "Database Supabase aktif!", 
        data,
        timestamp: new Date().toISOString() 
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Ping Error (Catch):", err);
    return NextResponse.json(
      {
        status: "error",
        message: "Terjadi kesalahan internal",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
