"use client";

import { useState } from "react";
import { signIn } from "@/lib/actions/auth";
import { AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signIn(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // If successful, signIn() calls redirect() — we never reach here.
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-background text-foreground py-12 overflow-y-auto overflow-x-hidden">
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Brand Title */}
        <div className="text-center mb-8 login-brand">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Lapor Park
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Sistem Berita Acara Parkir Digital
          </p>
        </div>

        {/* Neumorphic card */}
        <div className="neo-card p-8 login-card">
          {/* Logos inside card */}
          <div className="flex items-center justify-between mb-6">
            <img src="/logo-aps.png" alt="Angkasa Pura Supports" className="h-12 w-auto object-contain drop-shadow-md login-logo-left" />
            <img src="/logo-cp.png" alt="Centre Park" className="h-9 w-auto object-contain drop-shadow-md login-logo-right" />
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
