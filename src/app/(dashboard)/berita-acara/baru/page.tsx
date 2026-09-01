"use client";

import { useState } from "react";
import { createBeritaAcara } from "@/lib/actions/berita-acara";
import PhotoUpload from "@/components/photo-upload";
import {
  JENIS_INSIDEN_LABELS,
  type JenisInsiden,
  type CreateBAPayload,
} from "@/lib/types";
import {
  Loader2,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Send,
  Undo2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function CreateBAPage() {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  // Store original text for undo after AI cleanup
  const [originalTexts, setOriginalTexts] = useState<Record<string, string>>(
    {}
  );
  const [aiApplied, setAiApplied] = useState(false);

  // Form field refs (using controlled state for AI integration)
  const [judul, setJudul] = useState("");
  const [kronologi, setKronologi] = useState("");
  const [tindakan, setTindakan] = useState("");
  const [penyelesaian, setPenyelesaian] = useState("");
  const [mitigasi, setMitigasi] = useState("");

  async function handleAiRapikan() {
    if (!kronologi.trim()) {
      setError("Isi kronologi terlebih dahulu sebelum meminta AI merapikan.");
      return;
    }

    setAiLoading(true);
    setError(null);

    // Save originals for undo
    setOriginalTexts({
      judul_masalah: judul,
      kronologi,
      tindakan_dilakukan: tindakan,
      penyelesaian,
      mitigasi,
    });

    try {
      const res = await fetch("/api/ai/rapikan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul_masalah: judul,
          kronologi,
          tindakan_dilakukan: tindakan,
          penyelesaian,
          mitigasi,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal merapikan teks.");
      }

      const data = await res.json();
      setJudul(data.judul_masalah || judul);
      setKronologi(data.kronologi || kronologi);
      setTindakan(data.tindakan_dilakukan || tindakan);
      setPenyelesaian(data.penyelesaian || penyelesaian);
      setMitigasi(data.mitigasi || mitigasi);
      setAiApplied(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Gagal menghubungi AI."
      );
    } finally {
      setAiLoading(false);
    }
  }

  function handleUndoAi() {
    setJudul(originalTexts.judul_masalah || "");
    setKronologi(originalTexts.kronologi || "");
    setTindakan(originalTexts.tindakan_dilakukan || "");
    setPenyelesaian(originalTexts.penyelesaian || "");
    setMitigasi(originalTexts.mitigasi || "");
    setAiApplied(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const payload: CreateBAPayload = {
      tanggal_kejadian: formData.get("tanggal_kejadian") as string,
      waktu_kejadian: formData.get("waktu_kejadian") as string,
      lokasi_zona: formData.get("lokasi_zona") as string,
      jenis_insiden: formData.get("jenis_insiden") as JenisInsiden,
      pihak_terlibat: (formData.get("pihak_terlibat") as string) || undefined,
      judul_masalah: judul,
      kronologi,
      tindakan_dilakukan: tindakan,
      penyelesaian,
      mitigasi,
      lampiran_foto: photos.length > 0 ? photos : undefined,
    };

    const result = await createBeritaAcara(payload);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // On success, createBeritaAcara calls redirect()
  }

  const inputClass =
    "w-full neo-inset px-5 py-3.5 text-slate-800 text-sm placeholder:text-slate-500 focus:outline-none focus-ring transition-all duration-200";

  const textareaClass = `${inputClass} min-h-[120px] resize-y`;

  const labelClass = "block text-sm font-medium text-slate-600 mb-1.5";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/berita-acara"
          className="p-2 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-slate-500 hover:text-slate-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Buat Berita Acara Baru
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Laporkan insiden di area parkir
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section: Informasi Kejadian */}
        <div className="neo-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-300 pb-4 mb-4">
            Informasi Kejadian
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tanggal_kejadian" className={labelClass}>
                Tanggal Kejadian *
              </label>
              <input
                id="tanggal_kejadian"
                name="tanggal_kejadian"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="waktu_kejadian" className={labelClass}>
                Waktu Kejadian *
              </label>
              <input
                id="waktu_kejadian"
                name="waktu_kejadian"
                type="time"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="lokasi_zona" className={labelClass}>
                Lokasi / Zona Parkir *
              </label>
              <input
                id="lokasi_zona"
                name="lokasi_zona"
                type="text"
                required
                placeholder="contoh: Zona A, Gate 3"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="jenis_insiden" className={labelClass}>
                Jenis Insiden *
              </label>
              <div className="relative">
                <select
                  id="jenis_insiden"
                  name="jenis_insiden"
                  required
                  className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                >
                  {Object.entries(JENIS_INSIDEN_LABELS).map(([value, label]) => (
                    <option key={value} value={value} className="bg-[#e0e5ec] text-slate-800">
                      {label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="pihak_terlibat" className={labelClass}>
              Pihak Terlibat{" "}
              <span className="text-slate-500">(opsional)</span>
            </label>
            <input
              id="pihak_terlibat"
              name="pihak_terlibat"
              type="text"
              placeholder="Nama, kontak, plat nomor jika relevan"
              className={inputClass}
            />
          </div>
        </div>

        {/* Section: Detail Laporan */}
        <div className="neo-card p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-300 pb-4 mb-4">
            <h2 className="text-sm font-semibold text-slate-800">Detail Laporan</h2>

            {/* AI Rapikan button */}
            <div className="flex items-center gap-2">
              {aiApplied && (
                <button
                  type="button"
                  onClick={handleUndoAi}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  <Undo2 className="w-4 h-4" />
                  Undo AI
                </button>
              )}
              <button
                type="button"
                onClick={handleAiRapikan}
                disabled={aiLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 transition-all shadow-[0_4px_15px_rgba(139,92,246,0.3)] cursor-pointer"
              >
                {aiLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {aiLoading ? "Merapikan..." : "Minta AI Merapikan"}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="judul_masalah" className={labelClass}>
              Judul Masalah *
            </label>
            <input
              id="judul_masalah"
              type="text"
              required
              placeholder="Ringkasan singkat masalah"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="kronologi" className={labelClass}>
              Kronologi *
            </label>
            <textarea
              id="kronologi"
              required
              placeholder="Deskripsikan kejadian secara kronologis..."
              value={kronologi}
              onChange={(e) => setKronologi(e.target.value)}
              className={textareaClass}
            />
          </div>

          <div>
            <label htmlFor="tindakan_dilakukan" className={labelClass}>
              Tindakan yang Dilakukan *
            </label>
            <textarea
              id="tindakan_dilakukan"
              required
              placeholder="Tindakan yang diambil saat/setelah insiden..."
              value={tindakan}
              onChange={(e) => setTindakan(e.target.value)}
              className={textareaClass}
            />
          </div>

          <div>
            <label htmlFor="penyelesaian" className={labelClass}>
              Penyelesaian *
            </label>
            <textarea
              id="penyelesaian"
              required
              placeholder="Bagaimana masalah akhirnya diselesaikan..."
              value={penyelesaian}
              onChange={(e) => setPenyelesaian(e.target.value)}
              className={textareaClass}
            />
          </div>

          <div>
            <label htmlFor="mitigasi" className={labelClass}>
              Mitigasi *
            </label>
            <textarea
              id="mitigasi"
              required
              placeholder="Rencana pencegahan agar tidak terulang..."
              value={mitigasi}
              onChange={(e) => setMitigasi(e.target.value)}
              className={textareaClass}
            />
          </div>
        </div>

        {/* Section: Lampiran Foto */}
        <div className="neo-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-300 pb-4 mb-4">
            Lampiran Foto{" "}
            <span className="text-slate-500 font-normal">(opsional)</span>
          </h2>
          <PhotoUpload photos={photos} onChange={setPhotos} />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-[0_4px_15px_rgba(14,165,233,0.3)] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Kirim Berita Acara
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
