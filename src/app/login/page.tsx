"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/actions/auth";
import { AlertCircle, Loader2, Check, Eye, EyeOff, BookOpen } from "lucide-react";
import WaterDropLoader from "@/components/water-drop-loader";
import LaporParkLogo from "@/components/lapor-park-logo";

const REMEMBER_EMAIL_KEY = "lapor-park-remember-email";
const REMEMBER_PASS_KEY = "lapor-park-remember-pass";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [showScanLine, setShowScanLine] = useState(false);

  const handleTogglePassword = useCallback(() => {
    if (isBlinking) return;
    setIsBlinking(true);
    setShowRipple(true);
    // At the midpoint of the blink, switch visibility and trigger scan
    setTimeout(() => {
      setShowPassword(prev => !prev);
      setShowScanLine(true);
    }, 150);
    // End blink
    setTimeout(() => {
      setIsBlinking(false);
    }, 300);
    // Clear ripple
    setTimeout(() => {
      setShowRipple(false);
    }, 600);
    // Clear scan line
    setTimeout(() => {
      setShowScanLine(false);
    }, 700);
  }, [isBlinking]);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // On mount, check localStorage for remembered credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
    const savedPass = localStorage.getItem(REMEMBER_PASS_KEY);
    if (savedEmail && emailRef.current) {
      emailRef.current.value = savedEmail;
      setRememberMe(true);
    }
    if (savedPass && passwordRef.current) {
      try {
        passwordRef.current.value = atob(savedPass);
      } catch {
        // ignore corrupted data
      }
    }
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    // Save or clear remembered credentials
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (rememberMe && email) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, email);
      localStorage.setItem(REMEMBER_PASS_KEY, btoa(password));
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
      localStorage.removeItem(REMEMBER_PASS_KEY);
    }

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
    <div className="min-h-screen flex items-center justify-center relative bg-background text-foreground py-4 sm:py-6 overflow-y-auto overflow-x-hidden">
      {/* Water Droplet & Ripple Loading Animation */}
      {isSuccess && <WaterDropLoader />}

      {/* Login Card Container */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 transition-all duration-700 ease-out ${
          isSuccess ? "filter blur-[3px] scale-[0.97] opacity-30 pointer-events-none" : ""
        }`}
      >
        {/* Brand Title with Animated Emblem */}
        <div className="flex flex-col items-center text-center mb-4 login-brand">
          <div className="mb-2">
            <LaporParkLogo size="md" interactive={true} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
            <span>Lapor</span>
            <span className="text-emerald-500">Park</span>
          </h1>
          <p className="text-slate-500 mt-0.5 text-xs sm:text-sm">
            Sistem Manajemen Berita Acara Parkir
          </p>
        </div>

        {/* Neumorphic card */}
        <div className="neo-card p-6 sm:p-7 login-card">
          {/* Corporate Partner Logos inside card - Presisi Lockup */}
          <div className="mb-4 p-2 rounded-xl bg-white/40 border border-white/60 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),inset_-1px_-1px_3px_rgba(163,177,198,0.25)]">
            <div className="grid grid-cols-2 items-center gap-2.5 px-2 py-0.5">
              <div className="flex items-center justify-center h-9 px-2 rounded-lg bg-white/60 border border-white/80 shadow-sm transition-transform duration-200 hover:scale-105">
                <img
                  src="/logo-aps.png"
                  alt="Angkasa Pura Supports"
                  className="h-6 max-h-6 w-auto max-w-full object-contain drop-shadow-sm"
                />
              </div>
              <div className="flex items-center justify-center h-9 px-2 rounded-lg bg-white/60 border border-white/80 shadow-sm transition-transform duration-200 hover:scale-105">
                <img
                  src="/logo-cp.png"
                  alt="Centre Park"
                  className="h-5.5 max-h-6 w-auto max-w-full object-contain drop-shadow-sm"
                />
              </div>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-4 text-center login-title">Masuk</h2>

          <form action={handleSubmit} className="space-y-3.5">
            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-100 border border-red-200 px-3.5 py-2.5 text-red-600 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5 login-field-1">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-600 ml-1"
              >
                Email
              </label>
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="nama@bandara.co.id"
                className="neo-inset w-full px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5 login-field-2">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-600 ml-1"
              >
                Password
              </label>
              <div className="relative overflow-hidden">
                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="neo-inset w-full px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200"
                />
                {/* Scan line shimmer on reveal */}
                <div
                  className={`absolute inset-0 pointer-events-none rounded-xl ${
                    showScanLine ? "animate-[scanReveal_0.5s_ease-out_forwards]" : ""
                  }`}
                  style={{
                    background: showScanLine
                      ? "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.12) 45%, rgba(16,185,129,0.25) 50%, rgba(16,185,129,0.12) 55%, transparent 100%)"
                      : "none",
                    opacity: showScanLine ? 1 : 0,
                  }}
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 transition-colors duration-200"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {/* Ripple ring */}
                  <span
                    className={`absolute inset-0 rounded-full transition-all duration-500 ease-out ${
                      showRipple
                        ? "scale-[2.2] opacity-0 bg-emerald-400/20"
                        : "scale-100 opacity-0 bg-emerald-400/30"
                    }`}
                    style={{ willChange: showRipple ? "transform, opacity" : "auto" }}
                  />
                  {/* Eye icon with blink animation */}
                  <div
                    className="relative w-4 h-4 transition-transform ease-in-out"
                    style={{
                      transform: isBlinking ? "scaleY(0.1)" : "scaleY(1)",
                      transitionDuration: isBlinking ? "150ms" : "200ms",
                    }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2.5 ml-0.5 login-remember">
              <button
                type="button"
                role="checkbox"
                aria-checked={rememberMe}
                id="remember-me"
                onClick={() => setRememberMe(!rememberMe)}
                className={`
                  relative w-[18px] h-[18px] rounded-md flex-shrink-0
                  transition-all duration-300 ease-out
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-1
                  ${rememberMe
                    ? "bg-emerald-500 shadow-[0_1px_3px_rgba(16,185,129,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)]"
                    : "bg-white/70 shadow-[inset_1px_1px_2px_rgba(163,177,198,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] border border-slate-200/60"
                  }
                `}
              >
                <Check
                  className={`
                    w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    text-white stroke-[3]
                    transition-all duration-300 ease-out
                    ${rememberMe ? "opacity-100 scale-100" : "opacity-0 scale-50"}
                  `}
                />
              </button>
              <label
                htmlFor="remember-me"
                onClick={() => setRememberMe(!rememberMe)}
                className="text-xs font-medium text-slate-500 cursor-pointer select-none hover:text-slate-700 transition-colors duration-200"
              >
                Ingat Saya
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="neo-button login-button w-full px-4 py-2.5 text-sm text-accent font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-1"
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

        {/* Manual Book Link */}
        <Link
          href="/manual"
          className="relative z-20 group flex items-center justify-center gap-2 mx-auto mt-4 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 border border-emerald-500/25 hover:border-emerald-500/50 shadow-sm transition-all duration-200 cursor-pointer w-fit"
        >
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>Panduan Penggunaan (Manual Book)</span>
        </Link>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 font-medium mt-3">
          Angkasa Pura Supports — Unit Parkir
        </p>
      </div>
    </div>
  );
}

