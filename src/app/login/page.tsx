"use client";

import { useState } from "react";
import { signIn } from "@/lib/actions/auth";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center relative bg-background text-foreground">
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl neo-card mb-4 text-accent">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Lapor Park
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Sistem Berita Acara Parkir Digital
          </p>
        </div>

        {/* Neumorphic card */}
        <div className="neo-card p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">Masuk</h2>

          <form action={handleSubmit} className="space-y-5">
            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-100 border border-red-200 px-4 py-3 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
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
            <div className="space-y-2">
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
              className="neo-button w-full px-4 py-3 text-accent font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
        <p className="text-center text-xs text-slate-500 mt-8">
          Bandara Internasional Syamsudin Noor — Unit Parkir
        </p>
      </div>
    </div>
  );
}
