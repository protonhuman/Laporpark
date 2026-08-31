"use client";

import { useState } from "react";
import { updateBeritaAcara } from "@/lib/actions/berita-acara";
import PhotoUpload from "@/components/photo-upload";
import type { BeritaAcara, UpdateBAPayload, StatusBA } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import {
  Loader2,
  ArrowLeft,
  Save,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface EditFormProps {
  ba: BeritaAcara;
  userRole: string;
}

// Possible status transitions based on current status
const STATUS_TRANSITIONS: Record<StatusBA, StatusBA[]> = {
  draft: ["menunggu_review"],
  menunggu_review: ["diperiksa", "revisi"],
  diperiksa: ["disetujui", "revisi"],
  revisi: ["menunggu_review"],
  disetujui: ["selesai"],
  selesai: [],
};

export default function EditBAForm({ ba, userRole }: EditFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [judul, setJudul] = useState(ba.judul_masalah);
  const [kronologi, setKronologi] = useState(ba.kronologi);
  const [tindakan, setTindakan] = useState(ba.tindakan_dilakukan);
  const [penyelesaian, setPenyelesaian] = useState(ba.penyelesaian);
  const [mitigasi, setMitigasi] = useState(ba.mitigasi);
  const [pihakTerlibat, setPihakTerlibat] = useState(
    ba.pihak_terlibat ?? ""
  );
  const [lokasiZona, setLokasiZona] = useState(ba.lokasi_zona);
  const [status, setStatus] = useState<StatusBA>(ba.status);
  const [photos, setPhotos] = useState<string[]>(ba.lampiran_foto || []);

  const availableStatuses = STATUS_TRANSITIONS[ba.status] ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: UpdateBAPayload = {
      judul_masalah: judul,
      kronologi,
      tindakan_dilakukan: tindakan,
      penyelesaian,
      mitigasi,
      pihak_terlibat: pihakTerlibat || undefined,
      lokasi_zona: lokasiZona,
      lampiran_foto: photos,
      ...(status !== ba.status ? { status } : {}),
    };

    const result = await updateBeritaAcara(ba.id, payload);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // On success, updateBeritaAcara calls redirect()
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
          href={`/berita-acara/${ba.id}`}
          className="p-2 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-slate-500 hover:text-slate-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Edit Berita Acara</h1>
          <p className="text-slate-500 text-sm mt-0.5 font-mono">
            {ba.nomor_ba}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status change */}
        {availableStatuses.length > 0 && (
          <div className="neo-card p-6">
            <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-300 pb-4 mb-4">
              Ubah Status
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStatus(ba.status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  status === ba.status
                    ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                    : "text-slate-500 border border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)] hover:bg-white/[0.04]"
                }`}
              >
                Tetap: {STATUS_LABELS[ba.status]}
              </button>
              {availableStatuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    status === s
                      ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                      : "text-slate-500 border border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)] hover:bg-white/[0.04]"
                  }`}
                >
                  → {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content edit */}
        <div className="neo-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-300 pb-4 mb-4">
            Edit Konten
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Lokasi / Zona</label>
              <input
                type="text"
                value={lokasiZona}
                onChange={(e) => setLokasiZona(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Pihak Terlibat</label>
              <input
                type="text"
                value={pihakTerlibat}
                onChange={(e) => setPihakTerlibat(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Judul Masalah</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Kronologi</label>
            <textarea
              value={kronologi}
              onChange={(e) => setKronologi(e.target.value)}
              className={textareaClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tindakan yang Dilakukan</label>
            <textarea
              value={tindakan}
              onChange={(e) => setTindakan(e.target.value)}
              className={textareaClass}
            />
          </div>

          <div>
            <label className={labelClass}>Penyelesaian</label>
            <textarea
              value={penyelesaian}
              onChange={(e) => setPenyelesaian(e.target.value)}
              className={textareaClass}
            />
          </div>

          <div>
            <label className={labelClass}>Mitigasi</label>
            <textarea
              value={mitigasi}
              onChange={(e) => setMitigasi(e.target.value)}
              className={textareaClass}
            />
          </div>

          <div>
            <label className={labelClass}>Lampiran Foto Dokumentasi</label>
            <PhotoUpload photos={photos} onChange={setPhotos} maxPhotos={5} />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-slate-800 font-medium hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
