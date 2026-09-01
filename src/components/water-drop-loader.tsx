"use client";

import { Droplets, CheckCircle2 } from "lucide-react";

interface WaterDropLoaderProps {
  onComplete?: () => void;
}

const SPLASH_PARTICLES = [
  { id: 1, sx: "-55px", sy: "-42px", size: 8, delay: "0.48s" },
  { id: 2, sx: "58px", sy: "-38px", size: 7, delay: "0.49s" },
  { id: 3, sx: "-36px", sy: "-65px", size: 6, delay: "0.50s" },
  { id: 4, sx: "38px", sy: "-60px", size: 8, delay: "0.48s" },
  { id: 5, sx: "-70px", sy: "-20px", size: 5, delay: "0.52s" },
  { id: 6, sx: "72px", sy: "-22px", size: 6, delay: "0.51s" },
];

export default function WaterDropLoader({ onComplete }: WaterDropLoaderProps) {
  return (
    <div
      aria-label="Memuat Dashboard"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background/85 backdrop-blur-md transition-opacity duration-500"
    >
      {/* Container for ripple epicenter */}
      <div className="relative flex items-center justify-center w-full h-full">
        {/* Falling Water Droplet */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
          <div className="water-drop-anim flex flex-col items-center">
            <div className="teardrop-shape" />
          </div>
        </div>

        {/* Splash Micro-Particles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          {SPLASH_PARTICLES.map((p) => (
            <span
              key={p.id}
              style={
                {
                  "--sx": p.sx,
                  "--sy": p.sy,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  animation: `waterSplash 0.58s cubic-bezier(0.22, 0.61, 0.36, 1) ${p.delay} forwards`,
                } as React.CSSProperties
              }
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-300 shadow-[0_2px_8px_rgba(79,70,229,0.4)] opacity-0 pointer-events-none"
            />
          ))}
        </div>

        {/* Concentric Ripple Waves */}
        <div className="absolute top-1/2 left-1/2 pointer-events-none z-10">
          {/* Ripple 1: Outermost strong wave */}
          <div className="water-ripple-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-indigo-500/40 bg-indigo-500/[0.03] shadow-[0_0_30px_rgba(99,102,241,0.3),inset_0_0_20px_rgba(255,255,255,0.7)] pointer-events-none" />

          {/* Ripple 2: Mid wave */}
          <div className="water-ripple-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-indigo-400/50 bg-indigo-400/[0.04] shadow-[0_0_25px_rgba(99,102,241,0.35),inset_0_0_25px_rgba(255,255,255,0.8)] pointer-events-none" />

          {/* Ripple 3: Core wave */}
          <div className="water-ripple-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/60 bg-cyan-400/[0.05] shadow-[0_0_20px_rgba(56,189,248,0.4)] pointer-events-none" />
        </div>

        {/* Center Content: Neumorphic Liquid Pod */}
        <div className="water-center-content relative z-30 flex flex-col items-center">
          <div className="neo-card p-6 sm:p-8 rounded-3xl flex flex-col items-center text-center max-w-[290px] sm:max-w-xs mx-4 shadow-[12px_12px_24px_var(--shadow-dark),-12px_-12px_24px_var(--shadow-light)] border border-white/40">
            {/* Water Drop & Check Icon */}
            <div className="relative mb-4 sm:mb-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl neo-inset flex items-center justify-center text-accent water-liquid-pulse">
                <Droplets className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            {/* Badge */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 mb-2">
              Login Berhasil
            </span>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
              Menyiapkan Dashboard
            </h3>
            <p className="text-xs text-slate-500 mb-4 sm:mb-5">
              Memuat profil dan sesi Anda...
            </p>

            {/* Animated Liquid Progress Bar */}
            <div className="w-40 sm:w-48 h-2.5 rounded-full neo-inset p-0.5 overflow-hidden">
              <div className="water-bar-fill h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 shadow-[0_0_12px_rgba(79,70,229,0.5)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
