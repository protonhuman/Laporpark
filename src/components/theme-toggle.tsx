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
        className={`relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer ${
          isDark
            ? "bg-slate-800/90 border border-white/10 shadow-inner"
            : "bg-slate-200/70 hover:bg-slate-200/90 border border-slate-300/50 shadow-sm"
        } ${className}`}
        aria-label={isDark ? "Beralih ke Mode Terang (Siang)" : "Beralih ke Mode Gelap (Malam)"}
        title={isDark ? "Mode Malam aktif. Klik untuk Mode Siang" : "Mode Siang aktif. Klik untuk Mode Malam"}
      >
        <div className="relative w-4 h-4">
          <Sun
            className={`w-4 h-4 text-amber-500 transition-all duration-500 transform absolute inset-0 ${
              isDark
                ? "rotate-[180deg] scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
          />
          <Moon
            className={`w-4 h-4 text-sky-400 transition-all duration-500 transform absolute inset-0 ${
              isDark
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-[180deg] scale-0 opacity-0"
            }`}
          />
        </div>
      </button>
    );
  }

  // Sidebar variant: full interactive rolling switch
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
            <Moon className="w-4 h-4 text-sky-400 transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 group-hover:scale-110" />
          )}
        </div>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {isDark ? "Mode Malam" : "Mode Siang"}
        </span>
      </div>

      {/* Rolling Pill Track */}
      <div
        className={`relative w-[52px] h-[28px] p-[2px] rounded-full transition-colors duration-500 overflow-hidden cursor-pointer ${
          isDark
            ? "bg-slate-800 border border-sky-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
            : "bg-sky-200/90 border border-sky-300/80 shadow-[inset_0_2px_4px_rgba(14,165,233,0.2)]"
        }`}
      >
        {/* Daytime decorative cloud on the right */}
        <div
          className={`absolute right-1.5 top-1/2 -translate-y-1/2 transition-all duration-500 pointer-events-none ${
            isDark ? "opacity-0 scale-50 translate-x-2" : "opacity-90 scale-100 translate-x-0"
          }`}
        >
          <div className="w-3 h-1.5 bg-white/90 rounded-full shadow-xs" />
        </div>

        {/* Nighttime decorative stars on the left */}
        <div
          className={`absolute left-2 top-1/2 -translate-y-1/2 transition-all duration-500 pointer-events-none flex items-center gap-1 ${
            isDark ? "opacity-90 scale-100 translate-x-0" : "opacity-0 scale-50 -translate-x-2"
          }`}
        >
          <div className="w-1 h-1 bg-amber-200 rounded-full" />
          <div className="w-1.5 h-1.5 bg-sky-200 rounded-full" />
        </div>

        {/* Rolling Thumb Knob */}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] shadow-md transform ${
            isDark
              ? "translate-x-[24px] rotate-[360deg] bg-slate-900 border border-sky-400/50 text-sky-300 shadow-[0_2px_8px_rgba(56,189,248,0.35)]"
              : "translate-x-0 rotate-0 bg-amber-400 border border-amber-300 text-amber-950 shadow-[0_2px_8px_rgba(245,158,11,0.5)]"
          }`}
        >
          {/* Morphing Sun & Moon inside the rolling knob */}
          <div className="relative w-3.5 h-3.5 flex items-center justify-center">
            <Sun
              className={`w-3.5 h-3.5 transition-all duration-500 transform absolute ${
                isDark
                  ? "rotate-180 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <Moon
              className={`w-3.5 h-3.5 transition-all duration-500 transform absolute ${
                isDark
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-180 scale-0 opacity-0"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
