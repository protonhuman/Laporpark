"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { changeMyPasswordAction } from "@/lib/actions/users";
import { KeyRound, Eye, EyeOff, Loader2, X, CheckCircle2, AlertCircle } from "lucide-react";

export default function ChangePasswordModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleOpen() {
    setError(null);
    setSuccess(false);
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("Password baru harus memiliki minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok dengan password baru.");
      return;
    }

    setLoading(true);
    const result = await changeMyPasswordAction(newPassword);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        setOpen(false);
      }, 1800);
    }
  }

  const inputClass =
    "neo-inset w-full px-4 py-2.5 text-foreground text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all";

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-accent hover:bg-white/[0.04] transition-all duration-200 cursor-pointer mb-1"
      >
        <KeyRound className="w-4 h-4 text-slate-500" />
        Ganti Password
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !loading && setOpen(false)}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-sm neo-card p-6 shadow-2xl border border-white/30 z-10">
              <button
                type="button"
                onClick={() => !loading && setOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl neo-inset flex items-center justify-center text-accent">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Ganti Password
                  </h2>
                  <p className="text-xs text-slate-500">
                    Perbarui kata sandi akun Anda
                  </p>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-2.5 text-red-600 text-xs mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 text-emerald-600 text-xs mb-4">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <p>Password berhasil diperbarui!</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5 ml-1">
                    Password Baru (min. 6 karakter)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Masukkan password baru"
                      className={`${inputClass} pr-10`}
                      disabled={loading || success}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors p-0.5"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5 ml-1">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className={inputClass}
                    disabled={loading || success}
                  />
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-[11px] text-red-500 mt-1 ml-1">
                      Password tidak cocok
                    </p>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={loading || success}
                    className="px-4 py-2.5 rounded-xl neo-button text-slate-600 text-xs font-medium hover:text-slate-800 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      success ||
                      newPassword.length < 6 ||
                      newPassword !== confirmPassword
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl neo-button text-accent text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Password"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
