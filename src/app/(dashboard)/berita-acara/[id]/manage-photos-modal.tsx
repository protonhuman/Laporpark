"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { updateLampiranFotoAction } from "@/lib/actions/berita-acara";
import PhotoUpload from "@/components/photo-upload";
import { ImageIcon, Loader2, X, AlertCircle, CheckCircle2, Pencil } from "lucide-react";

interface ManagePhotosModalProps {
  baId: string;
  initialPhotos: string[];
}

export default function ManagePhotosModal({
  baId,
  initialPhotos,
}: ManagePhotosModalProps) {
  const [open, setOpen] = useState(false);
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  function handleOpen() {
    setPhotos(initialPhotos);
    setError(null);
    setSuccess(false);
    setOpen(true);
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    try {
      const res = await updateLampiranFotoAction(baId, photos);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setOpen(false);
          router.refresh();
        }, 1200);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan foto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 transition-all cursor-pointer"
        title="Ubah atau tambah foto dokumentasi kapan saja"
      >
        <Pencil className="w-3.5 h-3.5" />
        <span>Kelola Lampiran Foto</span>
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-100 dark:bg-slate-900 border border-white/20 dark:border-white/10 rounded-2xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white text-base">
                      Kelola Lampiran Foto
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tambah atau hapus foto dokumentasi Berita Acara
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Lampiran foto berhasil diperbarui!</span>
                </div>
              )}

              <div className="py-2">
                <PhotoUpload
                  photos={photos}
                  onChange={setPhotos}
                  maxPhotos={5}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading || success}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-900 text-xs font-semibold disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Simpan Perubahan Foto
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
