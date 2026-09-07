import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SYSTEM_PROMPT = `Kamu adalah asisten profesional yang bertugas merapikan laporan Berita Acara insiden parkir di bandara. 

ATURAN KETAT:
1. Perbaiki tata bahasa, ejaan, tanda baca, dan struktur kalimat agar profesional dan formal.
2. JANGAN mengubah fakta, data, nama, lokasi, waktu, atau informasi apapun yang sudah ditulis.
3. JANGAN menambahkan informasi baru yang tidak ada di teks asli.
4. JANGAN menghapus informasi yang sudah ada.
5. Jika teks asli berupa poin-poin singkat, ubah menjadi paragraf yang mengalir baik tanpa mengubah isinya.
6. Gunakan bahasa Indonesia baku dan formal.
7. Kembalikan hasil dalam format JSON dengan field yang sama persis.`;

export async function POST(request: Request) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Tidak terautentikasi." },
        { status: 401 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key belum dikonfigurasi." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { judul_masalah, kronologi, tindakan_dilakukan, penyelesaian, mitigasi } = body;

    if (!kronologi) {
      return NextResponse.json(
        { error: "Kronologi harus diisi." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const userPrompt = `Rapikan teks Berita Acara berikut. Kembalikan hasilnya dalam format JSON valid dengan field: judul_masalah, kronologi, tindakan_dilakukan, penyelesaian, mitigasi.

Teks asli:

Judul Masalah: ${judul_masalah || "(kosong)"}

Kronologi: ${kronologi}

Tindakan yang Dilakukan: ${tindakan_dilakukan || "(kosong)"}

Penyelesaian: ${penyelesaian || "(kosong)"}

Mitigasi: ${mitigasi || "(kosong)"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.3, // Low temp for factual preservation
      },
    });

    const text = response.text ?? "";

    // Parse the JSON response
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      // Try extracting JSON from markdown code block
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("AI mengembalikan format yang tidak valid.");
      }
    }

    return NextResponse.json({
      judul_masalah: result.judul_masalah || judul_masalah,
      kronologi: result.kronologi || kronologi,
      tindakan_dilakukan: result.tindakan_dilakukan || tindakan_dilakukan,
      penyelesaian: result.penyelesaian || penyelesaian,
      mitigasi: result.mitigasi || mitigasi,
    });
  } catch (error: unknown) {
    console.error("AI rapikan error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memproses AI.",
      },
      { status: 500 }
    );
  }
}
