"use client";

import { useTheme } from "@/components/theme-provider";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  variant?: "sidebar" | "icon";
  className?: string;
}

export default function ThemeToggle({
  variant = "sidebar",
  className = "",
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render placeholder with same dimensions to prevent layout shift during hydration
    if (variant === "icon") {
      return (
        <div className={`w-9 h-9 rounded-xl neo-button opacity-50 ${className}`} />
      );
    }
    return (
      <div className={`w-full h-10 rounded-xl neo-button opacity-50 ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
          isDark
            ? "bg-slate-800/80 border border-white/10 shadow-inner"
            : "bg-slate-200/60 hover:bg-slate-200/80 border border-slate-300/40"
        } ${className}`}
        aria-label={isDark ? "Beralih ke Mode Terang (Siang)" : "Beralih ke Mode Gelap (Malam)"}
        title={isDark ? "Mode Malam aktif. Klik untuk Mode Siang" : "Mode Siang aktif. Klik untuk Mode Malam"}
      >
        <div className="relative w-4 h-4">
          <Sun
            className={`w-4 h-4 text-amber-500 transition-all duration-300 transform absolute inset-0 ${
              isDark
                ? "rotate-90 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
          />
          <Moon
            className={`w-4 h-4 text-sky-400 transition-all duration-300 transform absolute inset-0 ${
              isDark
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-0 opacity-0"
            }`}
          />
        </div>
      </button>
    );
  }

  // Sidebar variant: full interactive pill switch
  return (
    <div
      onClick={toggleTheme}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/[0.04] transition-all duration-200 cursor-pointer select-none group ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleTheme();
        }
      }}
      aria-label="Ganti mode tampilan siang / malam"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 flex items-center justify-center">
          {isDark ? (
            <Moon className="w-4 h-4 text-sky-400 transition-transform group-hover:scale-110" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 transition-transform group-hover:scale-110" />
          )}
        </div>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {isDark ? "Mode Malam" : "Mode Siang"}
        </span>
      </div>

      {/* Pill Toggle Switch */}
      <div
        className={`w-11 h-6 p-0.5 rounded-full transition-colors duration-300 flex items-center ${
          isDark
            ? "bg-sky-500/20 border border-sky-500/40 justify-end"
            : "bg-slate-300/80 border border-slate-400/40 justify-start"
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm transform ${
            isDark
              ? "bg-sky-400 text-slate-900 translate-x-0"
              : "bg-white text-amber-500 translate-x-0"
          }`}
        >
          {isDark ? (
            <Moon className="w-3 h-3 fill-current" />
          ) : (
            <Sun className="w-3 h-3 fill-current" />
          )}
        </div>
      </div>
    </div>
  );
}
