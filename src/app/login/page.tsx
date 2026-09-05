"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/actions/auth";
import { AlertCircle, Loader2 } from "lucide-react";
import WaterDropLoader from "@/components/water-drop-loader";
import LaporParkLogo from "@/components/lapor-park-logo";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signIn(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setIsSuccess(true);
      setLoading(false);
      router.prefetch("/dashboard");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1600);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-background text-foreground py-12 overflow-y-auto overflow-x-hidden">
      {/* Water Droplet & Ripple Loading Animation */}
      {isSuccess && <WaterDropLoader />}

      {/* Login Card Container */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 transition-all duration-700 ease-out ${
          isSuccess ? "filter blur-[3px] scale-[0.97] opacity-30 pointer-events-none" : ""
        }`}
      >
        {/* Brand Title with Animated Emblem */}
        <div className="flex flex-col items-center text-center mb-6 login-brand">
          <div className="mb-3">
            <LaporParkLogo size="lg" interactive={true} />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
            <span>Lapor</span>
            <span className="text-emerald-500">Park</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Sistem Manajemen Berita Acara Parkir
          </p>
        </div>

        {/* Neumorphic card */}
        <div className="neo-card p-8 login-card">
          {/* Corporate Partner Logos inside card - Presisi Lockup */}
          <div className="mb-6 p-2.5 rounded-xl bg-white/40 border border-white/60 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),inset_-1px_-1px_3px_rgba(163,177,198,0.25)]">
            <div className="grid grid-cols-2 items-center gap-3 px-2 py-1">
              <div className="flex items-center justify-center h-10 px-2 rounded-lg bg-white/60 border border-white/80 shadow-sm transition-transform duration-200 hover:scale-105">
                <img
                  src="/logo-aps.png"
                  alt="Angkasa Pura Supports"
                  className="h-7 max-h-7 w-auto max-w-full object-contain drop-shadow-sm"
                />
              </div>
              <div className="flex items-center justify-center h-10 px-2 rounded-lg bg-white/60 border border-white/80 shadow-sm transition-transform duration-200 hover:scale-105">
                <img
                  src="/logo-cp.png"
                  alt="Centre Park"
                  className="h-6.5 max-h-7 w-auto max-w-full object-contain drop-shadow-sm"
                />
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center login-title">Masuk</h2>

          <form action={handleSubmit} className="space-y-5">
            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-100 border border-red-200 px-4 py-3 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2 login-field-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-600 ml-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="nama@bandara.co.id"
                className="neo-inset w-full px-4 py-3 text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="space-y-2 login-field-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-600 ml-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="neo-inset w-full px-4 py-3 text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="neo-button login-button w-full px-4 py-3 text-accent font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 font-medium mt-8 login-footer">
          Bandara Internasional Syamsudin Noor — Unit Parkir
        </p>
      </div>
    </div>
  );
}
