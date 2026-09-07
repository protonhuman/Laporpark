"use client";

import { useState } from "react";
import { createBeritaAcara } from "@/lib/actions/berita-acara";
import PhotoUpload from "@/components/photo-upload";
import {
  JENIS_INSIDEN_LABELS,
  type JenisInsiden,
  type CreateBAPayload,
  type BeritaAcaraWithUsers,
  type UserRole,
} from "@/lib/types";
import { DAFTAR_BANDARA } from "@/lib/constants";
import PrintLayout from "../[id]/print-layout";
import {
  Loader2,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Send,
  Undo2,
  ChevronDown,
  X,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function CreateBAPage() {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<CreateBAPayload | null>(null);

  // Store original text for undo after AI cleanup
  const [originalTexts, setOriginalTexts] = useState<Record<string, string>>(
    {}
  );
  const [aiApplied, setAiApplied] = useState(false);

  // User auth state for airport binding
  const [userRole, setUserRole] = useState<string>("team_leader");
  const [userKodeBandara, setUserKodeBandara] = useState<string>("BDJ");
  const [userName, setUserName] = useState<string>("Saya (Draft)");
  const [userSignature, setUserSignature] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("role, kode_bandara, nama, signature_url")
          .eq("id", user.id)
          .single();
        if (profile) {
          setUserRole(profile.role);
          if (profile.kode_bandara) {
            setUserKodeBandara(profile.kode_bandara);
          }
          if (profile.nama) setUserName(profile.nama);
          if (profile.signature_url) setUserSignature(profile.signature_url);
        }
      }
      setUserLoading(false);
    }
    loadUser();
  }, []);

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

    const lokasiZonaInput = (document.getElementById("lokasi_zona") as HTMLInputElement)?.value || "";

    try {
      const res = await fetch("/api/ai/rapikan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kode_bandara: userKodeBandara,
          lokasi_zona: lokasiZonaInput,
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const payload: CreateBAPayload = {
      tanggal_kejadian: formData.get("tanggal_kejadian") as string,
      waktu_kejadian: formData.get("waktu_kejadian") as string,
      kode_bandara: (formData.get("kode_bandara") as string) || userKodeBandara,
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

    setPreviewData(payload);
    setShowPreview(true);
  }

  async function handleConfirmSubmit() {
    if (!previewData) return;
    setLoading(true);
    setError(null);

    const result = await createBeritaAcara(previewData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      setShowPreview(false);
    }
    // On success, createBeritaAcara calls redirect()
  }

  const inputClass =
    "w-full neo-inset px-5 py-3.5 text-slate-800 text-sm placeholder:text-slate-500 focus:outline-none focus-ring transition-all duration-200";

  const textareaClass = `${inputClass} min-h-[120px] resize-y`;

  const labelClass = "block text-sm font-medium text-slate-600 mb-1.5";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Loading overlay if auth data is fetching */}
      {userLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      )}

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

          <div>
            <label htmlFor="kode_bandara" className={labelClass}>
              Lokasi Bandara *
            </label>
            <div className="relative">
              <select
                id="kode_bandara"
                name="kode_bandara"
                required
                value={userKodeBandara}
                onChange={(e) => setUserKodeBandara(e.target.value)}
                disabled={userRole !== "superadmin"}
                className={`${inputClass} appearance-none pr-10 ${userRole !== "superadmin" ? "bg-white/[0.02] cursor-not-allowed opacity-80" : "cursor-pointer"}`}
              >
                {DAFTAR_BANDARA.map((b) => (
                  <option key={b.kode} value={b.kode} className="bg-[#e0e5ec] text-slate-800">
                    {b.nama} — {b.lokasi} ({b.kode})
                  </option>
                ))}
              </select>
              {userRole !== "superadmin" && (
                <input type="hidden" name="kode_bandara" value={userKodeBandara} />
              )}
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                <ChevronDown className="w-4 h-4" />
              </div>
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold hover:from-sky-400 hover:to-indigo-500 transition-all shadow-[0_4px_15px_rgba(14,165,233,0.3)] cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            Preview Laporan
          </button>
        </div>
      </form>

      {/* Modal Preview */}
      {showPreview && previewData && (
        <>
          <style>{`
            @keyframes modalFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes modalSlideUp {
              from { opacity: 0; transform: translateY(20px) scale(0.97); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .animate-modal-backdrop {
              animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-modal-content {
              animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-modal-backdrop"
              onClick={() => !loading && setShowPreview(false)}
            />
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 animate-modal-content">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">Preview Berita Acara</h3>
              <button
                type="button"
                onClick={() => !loading && setShowPreview(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-0 sm:p-6 overflow-y-auto bg-slate-50">
              <PrintLayout 
                previewMode={true} 
                checker={null} 
                approver={null} 
                ba={{
                  id: "draft",
                  nomor_ba: "BA/DRAFT/" + new Date().getFullYear(),
                  tanggal_kejadian: previewData.tanggal_kejadian,
                  waktu_kejadian: previewData.waktu_kejadian,
                  kode_bandara: previewData.kode_bandara || userKodeBandara,
                  lokasi_zona: previewData.lokasi_zona,
                  jenis_insiden: previewData.jenis_insiden,
                  pihak_terlibat: previewData.pihak_terlibat || null,
                  judul_masalah: previewData.judul_masalah,
                  kronologi: previewData.kronologi,
                  tindakan_dilakukan: previewData.tindakan_dilakukan,
                  penyelesaian: previewData.penyelesaian || "",
                  mitigasi: previewData.mitigasi || "",
                  lampiran_foto: previewData.lampiran_foto || null,
                  status: "menunggu_review",
                  dibuat_oleh: "me",
                  direview_oleh: null,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  pembuat: {
                    id: "me",
                    email: "",
                    kode_bandara: userKodeBandara,
                    nama: userName,
                    role: userRole as UserRole,
                    signature_url: userSignature,
                  }
                }} 
              />
            </div>
            
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 transition-colors"
              >
                Edit Kembali
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 transition-all shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Konfirmasi & Kirim
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
