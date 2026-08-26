"use client";

import { useState } from "react";
import { createUserAction, deleteUserAction, updateUserPasswordAction, updateUserAction, type CreateUserPayload } from "@/lib/actions/users";
import ConfirmDialog from "@/components/confirm-dialog";
import { UserPlus, Loader2, X, AlertCircle, Trash2, KeyRound, CheckCircle2, Pencil } from "lucide-react";

export function CreateUserModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<CreateUserPayload["role"]>("team_leader");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createUserAction({
      nama,
      email,
      password: password || undefined,
      role,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setOpen(false);
      setLoading(false);
      // Reset form
      setNama("");
      setEmail("");
      setPassword("");
      setRole("team_leader");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all";
  const labelClass = "block text-xs font-medium text-slate-300 mb-1.5";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-medium hover:from-sky-400 hover:to-indigo-500 transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
      >
        <UserPlus className="w-4 h-4" />
        Tambah Pengguna
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md glass-card p-6 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6">Tambah Pengguna Baru</h2>
            
            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-300 text-sm mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Budi Santoso"
                  className={inputClass}
                />
              </div>
              
              <div>
                <label className={labelClass}>Alamat Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@laporpark.bdj.id"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Password (opsional, default: password123)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kosongkan untuk password default"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Hak Akses (Role) *</label>
                <select
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value as CreateUserPayload["role"])}
                  className={inputClass}
                >
                  <option value="team_leader" className="bg-[#0a0e1a]">Team Leader</option>
                  <option value="carpark_manager" className="bg-[#0a0e1a]">Carpark Manager</option>
                  <option value="supervisor" className="bg-[#0a0e1a]">Supervisor</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-slate-300 text-sm font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buat Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function DeleteUserButton({ userId, userName }: { userId: string, userName: string }) {
  const [showDialog, setShowDialog] = useState(false);

  async function handleDelete() {
    await deleteUserAction(userId);
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        title="Hapus Pengguna"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmDialog
        open={showDialog}
        title="Hapus Pengguna"
        message={`Apakah Anda yakin ingin menghapus akun ${userName}? Tindakan ini akan menghapus akses login dan data profil, tapi tidak menghapus Berita Acara yang pernah dibuatnya.`}
        confirmLabel="Hapus Akun"
        onConfirm={handleDelete}
        onCancel={() => setShowDialog(false)}
      />
    </>
  );
}

export function UpdatePasswordButton({ userId, userName }: { userId: string, userName: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await updateUserPasswordAction(userId, newPassword);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setNewPassword("");
      setTimeout(() => setOpen(false), 2000);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
        title="Ubah Password"
      >
        <KeyRound className="w-4 h-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm glass-card p-6 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-2">Ubah Password</h2>
            <p className="text-sm text-slate-400 mb-6">Ubah kata sandi untuk <strong>{userName}</strong></p>
            
            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-300 text-sm mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-emerald-400 text-sm mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <p>Password berhasil diubah!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Password Baru (min. 6 karakter)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru"
                  className={inputClass}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-slate-300 text-sm font-medium transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={loading || success || newPassword.length < 6}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Sandi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function UpdateUserButton({ userId, currentName, currentEmail }: { userId: string, currentName: string, currentEmail: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newName, setNewName] = useState(currentName);
  const [newEmail, setNewEmail] = useState(currentEmail);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await updateUserAction(userId, newName, newEmail);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => setOpen(false), 1000);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all";

  return (
    <>
      <button
        onClick={() => {
          setNewName(currentName);
          setNewEmail(currentEmail);
          setOpen(true);
          setSuccess(false);
        }}
        className="p-2 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
        title="Ubah Profil"
      >
        <Pencil className="w-4 h-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm glass-card p-6 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6">Ubah Profil Pengguna</h2>
            
            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-300 text-sm mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-emerald-400 text-sm mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <p>Profil berhasil diubah!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Budi Santoso"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="budi@laporpark.bdj.id"
                  className={inputClass}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-slate-300 text-sm font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || success || (!newName.trim() && !newEmail.trim()) || (newName.trim() === currentName && newEmail.trim() === currentEmail)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
