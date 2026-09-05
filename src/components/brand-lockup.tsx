"use client";

import React from "react";
import LaporParkLogo from "@/components/lapor-park-logo";

interface BrandLockupProps {
  variant?: "sidebar" | "banner" | "compact" | "login";
  className?: string;
}

export default function BrandLockup({
  variant = "sidebar",
  className = "",
}: BrandLockupProps) {
  if (variant === "sidebar") {
    return (
      <div className={`flex flex-col items-center w-full ${className}`}>
        {/* Lapor Park Brand Header with Animated Emblem */}
        <div className="flex items-center gap-3 w-full px-1">
          <LaporParkLogo size="md" interactive={true} />
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg font-extrabold text-slate-800 tracking-tight leading-none">
              Lapor<span className="text-emerald-500">Park</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium truncate mt-1">
              Berita Acara Digital
            </p>
          </div>
        </div>

        {/* Corporate Identity Lockup: APS & CentrePark - Presisi Frame */}
        <div className="mt-3.5 w-full">
          <div className="relative group overflow-hidden rounded-xl bg-white/40 border border-white/60 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),inset_-1px_-1px_3px_rgba(163,177,198,0.3),2px_2px_6px_rgba(163,177,198,0.25)] backdrop-blur-md p-2 transition-all duration-300 hover:bg-white/60 hover:shadow-md">
            {/* Exactly Balanced Logos Row */}
            <div className="grid grid-cols-2 items-center gap-2 px-1 py-1">
              {/* Angkasa Pura Supports */}
              <div className="flex items-center justify-center h-8 px-1.5 rounded-lg bg-white/50 border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] transition-transform duration-200 hover:scale-105">
                <img
                  src="/logo-aps.png"
                  alt="Angkasa Pura Supports"
                  className="h-6 max-h-6 w-auto max-w-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                />
              </div>

              {/* Centre Park */}
              <div className="flex items-center justify-center h-8 px-1.5 rounded-lg bg-white/50 border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] transition-transform duration-200 hover:scale-105">
                <img
                  src="/logo-cp.png"
                  alt="Centre Park"
                  className="h-5.5 max-h-6 w-auto max-w-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl neo-card p-5 sm:p-6 border border-white/50 backdrop-blur-xl ${className}`}
      >
        {/* Background glow ambiance */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#00ffcc]/15 via-[#39ff14]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center">
          {/* Lapor Park Brand with Animated Emblem */}
          <div className="flex items-center gap-4">
            <LaporParkLogo size="lg" interactive={true} />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Lapor<span className="text-emerald-500">Park</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Sistem Manajemen Berita Acara Parkir Bandara Internasional Syamsudin Noor Banjarmasin
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Variant: compact (for header bar or cards)
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <LaporParkLogo size="sm" />
    </div>
  );
}
