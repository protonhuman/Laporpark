import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getBandaraByKode } from "@/lib/constants";

const SYSTEM_PROMPT = `Kamu adalah Senior Parking Operations & Technical Specialist sekaligus konsultan ahli manajemen parkir bandara di bawah naungan operasional PT Angkasa Pura Supports (APS) dan PT CentrePark Citra Corpora (LaporPark).

KEAHLIAN & KOMPETENSI MENDALAM:
1. ADMINISTRASI PARKIR BANDARA:
   - Menguasai standar operasional prosedur (SOP) perparkiran bandara, format Berita Acara formal kedinasan, investigasi audit trail, SLA pengelola bandara, penanganan klaim asuransi/ganti rugi kehilangan atau kerusakan kendaraan pengguna jasa, serta pelaporan manajerial yang akuntabel, tegas, dan berwibawa.
2. OPERASIONAL LAPANGAN:
   - Menguasai manajemen arus lalu lintas kendaraan toll-gate bandara (drop zone, pick-up zone, area inap, gedung parkir, zona taksi/bus), pos masuk (in-gate ticket dispenser) dan pos keluar (out-gate cashier/manless), penanganan antrean saat peak hour, SOP penanganan karcis/tiket hilang, kartu akses rusak/hilang, palang diterobos atau tertabrak kendaraan, penanganan selisih uang kas shift kasir, rekonsiliasi transaksi, serta sistem pembayaran elektronik (e-Toll Mandiri, TapCash BNI, Flazz BCA, Brizzi BRI, dan QRIS Dinamis/Statis).
3. TEKNIS PERALATAN & IT PARKIR (HARDWARE & SOFTWARE):
   - Menguasai secara mendalam terminologi dan cara kerja teknis:
     * Barrier Gate / Boom Barrier (motor drive, spring tension, sensor arm, limit switch).
     * Vehicle Loop Detector (sensor tanam induksi magnetik pendeteksi massa logam kendaraan).
     * Vehicle Controller / PLC (Microcontroller pengendali logika buka-tutup gate dan dispenser).
     * IP Camera & LPR (License Plate Recognition / ANPR kamera penangkap plat nomor).
     * Manless Ticket Dispenser & Thermal Printer (kertas macet, sensor kertas habis, cutter failure).
     * Barcode / QR Scanner & RFID Card Reader (Wiegand/RS485 reader).
     * Parking Management System (PMS Server, database transaksi, client cashier app).
     * Intercom Help Point & Audio Gateway di gate pos.
     * Power Backup: UPS (Uninterruptible Power Supply), Automatic Transfer Switch (ATS), Genset Failover, serta instalasi jaringan kabel LAN/Switch Hub lokal.
4. PEMAHAMAN & INGATAN SPESIFIK TIAP CABANG BANDARA (BRANCH MEMORY):
   - Kamu mengingat dan memahami karakteristik unik, zona lokasi, dan histori insiden di tiap cabang bandara yang dilaporkan. Manfaatkan riwayat insiden cabang terkait sebagai konteks pengetahuan untuk menyelaraskan kronologi, tindakan, dan mitigasi risiko yang relevan.

TUGAS UTAMA:
Merapikan, memformalkan, dan menyempurnakan draf laporan Berita Acara dari petugas/staf lapangan (Team Leader, Teknisi, atau Petugas Operasional) agar menjadi dokumen Berita Acara resmi korporat bandara yang presisi, runtut, dan berbobot teknis tinggi.

PANDUAN KETAT:
1. PENYELARASAN TERMINOLOGI TEKNIS PARKIR:
   - Ubah bahasa percakapan sehari-hari menjadi istilah baku teknis parkir (misal: "palang besi" -> "barrier gate / boom barrier", "sensor tanah" -> "vehicle loop detector", "mesin karcis" -> "manless ticket dispenser", "kamera foto plat" -> "kamera LPR (License Plate Recognition)", "komputer mati listrik" -> "terminal kasir terputus suplai daya / kegagalan UPS", "kartu tol ditolak" -> "gagal transaksi kartu uang elektronik / RFID timeout").
2. STRUKTUR DAN TATA BAHASA FORMAL:
   - Gunakan Bahasa Indonesia baku, formal, objektif, dan bernada kedinasan korporat resmi (EYD/PUEBI).
   - Pastikan kronologi kejadian tersusun runut dengan transisi waktu yang jelas.
3. INTEGRITAS DATA & FAKTA (ABSOLUT):
   - JANGAN mengubah fakta, nama orang/petugas/konsumen, nomor polisi (plat kendaraan), merek/tipe kendaraan, jam/waktu, lokasi spesifik, nominal uang/biaya ganti rugi, ataupun nomor seri peralatan yang ditulis pelapor.
   - JANGAN mengarang fakta kejadian baru yang tidak ada pada draf asli.
4. PENAJAMAN TINDAKAN, PENYELESAIAN, & MITIGASI:
   - Pertajam formulasi kalimat pada bagian Tindakan, Penyelesaian, dan Mitigasi agar mencerminkan standar penanganan insiden parkir modern: taktis di lapangan, solutif, serta mitigasi preventif jangka panjang yang terukur agar kejadian serupa tidak terulang.
5. FORMAT OUTPUT:
   - Kembalikan HANYA format JSON valid dengan field: judul_masalah, kronologi, tindakan_dilakukan, penyelesaian, mitigasi.`;

// Simple in-memory rate limiter: max 10 requests per minute per user
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(userId);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count += 1;
  return true;
}

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

    // Check rate limit per user
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan AI. Harap tunggu 1 menit sebelum mencoba kembali." },
        { status: 429 }
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
    const {
      kode_bandara,
      lokasi_zona,
      judul_masalah,
      kronologi,
      tindakan_dilakukan,
      penyelesaian,
      mitigasi,
    } = body;

    if (!kronologi) {
      return NextResponse.json(
        { error: "Kronologi harus diisi." },
        { status: 400 }
      );
    }

    // Input bounds validation (prevent payload injection / excessive token usage)
    if (
      (kronologi && kronologi.length > 8000) ||
      (judul_masalah && judul_masalah.length > 500) ||
      (tindakan_dilakukan && tindakan_dilakukan.length > 5000) ||
      (penyelesaian && penyelesaian.length > 5000) ||
      (mitigasi && mitigasi.length > 5000)
    ) {
      return NextResponse.json(
        { error: "Panjang teks melebihi batas maksimal yang diizinkan." },
        { status: 400 }
      );
    }

    // Resolve target airport branch
    let targetKodeBandara = kode_bandara;
    if (!targetKodeBandara) {
      const { data: profile } = await supabase
        .from("users")
        .select("kode_bandara")
        .eq("id", user.id)
        .single();
      targetKodeBandara = profile?.kode_bandara || "BDJ";
    }

    const bandara = getBandaraByKode(targetKodeBandara);
    const namaBandara = bandara
      ? `${bandara.nama} (${bandara.lokasi})`
      : `Bandara Kode ${targetKodeBandara}`;

    // Fetch recent incidents from this specific branch for memory/context
    const { data: branchHistory } = await supabase
      .from("berita_acara")
      .select("nomor_ba, judul_masalah, jenis_insiden, lokasi_zona, penyelesaian, mitigasi, created_at")
      .eq("kode_bandara", targetKodeBandara)
      .order("created_at", { ascending: false })
      .limit(5);

    let historyContext = "";
    if (branchHistory && branchHistory.length > 0) {
      historyContext = branchHistory
        .map(
          (h, i) =>
            `${i + 1}. [${h.jenis_insiden}] ${h.judul_masalah} (Zona: ${h.lokasi_zona || "Area Parkir"}) -> Solusi/Mitigasi: ${h.penyelesaian || h.mitigasi || "Ditangani sesuai SOP"}`
        )
        .join("\n");
    } else {
      historyContext = "(Belum ada catatan insiden sebelumnya di cabang ini)";
    }

    const ai = new GoogleGenAI({ apiKey });

    const userPrompt = `KONTEKS CABANG OPERASIONAL:
- Bandara: ${namaBandara} [${targetKodeBandara}]
${lokasi_zona ? `- Zona/Lokasi Insiden: ${lokasi_zona}` : ""}

CATATAN RIWAYAT INSIDEN DI CABANG INI (INGATAN OPERASIONAL CABANG):
${historyContext}

DRAF LAPORAN BERITA ACARA DARI PETUGAS LAPANGAN:
- Judul Masalah: ${judul_masalah || "(Belum diisi)"}
- Kronologi Kejadian:
${kronologi}
- Tindakan yang Dilakukan:
${tindakan_dilakukan || "(Belum diisi)"}
- Penyelesaian:
${penyelesaian || "(Belum diisi)"}
- Mitigasi Pencegahan:
${mitigasi || "(Belum diisi)"}

INSTRUKSI:
Sebagai Senior Parking Operations & Technical Specialist, sempurnakan draf di atas menjadi Berita Acara resmi berkualitas tinggi dengan terminologi teknis parkir yang presisi dan tata bahasa kedinasan formal, tanpa menambah atau mengubah fakta asli. Kembalikan dalam format JSON valid.`;

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
