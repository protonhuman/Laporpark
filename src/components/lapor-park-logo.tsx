"use client";

import React, { useState } from "react";

interface LaporParkLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  interactive?: boolean;
  className?: string;
}

export default function LaporParkLogo({
  size = "md",
  showText = false,
  interactive = true,
  className = "",
}: LaporParkLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Size configurations
  const sizeMap = {
    sm: { box: "w-9 h-9", icon: 22, textTitle: "text-base", textSub: "text-[10px]" },
    md: { box: "w-11 h-11", icon: 28, textTitle: "text-lg", textSub: "text-[11px]" },
    lg: { box: "w-14 h-14", icon: 36, textTitle: "text-xl", textSub: "text-xs" },
    xl: { box: "w-20 h-20", icon: 52, textTitle: "text-2xl", textSub: "text-sm" },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${className}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      {/* Emblem Container with Dynamic Layers */}
      <div
        className={`relative flex items-center justify-center ${currentSize.box} transition-transform duration-300 ease-out ${
          isHovered ? "scale-110 -translate-y-0.5" : "anim-emblem-float"
        }`}
      >
        {/* Layer 1: Ambient Neon Glow Aura */}
        <div
          className={`absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-[#00ffcc] via-[#00d2ff] to-[#39ff14] anim-logo-aura pointer-events-none transition-opacity duration-300 ${
            isHovered ? "opacity-95 blur-md" : "opacity-60 blur-sm"
          }`}
        />

        {/* Layer 2: Rotating Orbital Rings */}
        <svg
          className="absolute -inset-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] pointer-events-none anim-orbital-spin text-[#00ffcc]/40"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="6 8 2 8"
          />
        </svg>

        <svg
          className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] pointer-events-none anim-orbital-spin-slow text-[#39ff14]/30"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 14"
          />
        </svg>

        {/* Layer 3: Solid / Neumorphic Shield Badge Base */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-[1.5px] shadow-xl overflow-hidden group">
          {/* Subtle gradient border highlight */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ffcc] via-transparent to-[#39ff14] opacity-80" />

          {/* Inner Badge Core */}
          <div className="relative w-full h-full rounded-[14px] bg-[#0c1222] flex items-center justify-center overflow-hidden">
            {/* Shimmer Light Ray Sweep */}
            <div className="absolute -inset-full w-[250%] h-[250%] bg-gradient-to-r from-transparent via-white/30 to-transparent anim-shimmer-sweep pointer-events-none" />

            {/* Emblem Vector Symbol: Parking Shield + Verified Checkmark */}
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[72%] h-[72%] relative z-10 drop-shadow-[0_2px_8px_rgba(0,255,204,0.5)]"
            >
              <defs>
                <linearGradient id="lpShieldGrad" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00ffcc" />
                  <stop offset="50%" stopColor="#00c8ff" />
                  <stop offset="100%" stopColor="#39ff14" />
                </linearGradient>
                <linearGradient id="lpCheckGrad" x1="18" y1="20" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#00ffcc" />
                </linearGradient>
              </defs>

              {/* Outer Protective Shield Geometry */}
              <path
                d="M24 4L8 10V22C8 32.5 14.8 42.2 24 44.5C33.2 42.2 40 32.5 40 22V10L24 4Z"
                fill="url(#lpShieldGrad)"
                fillOpacity="0.16"
                stroke="url(#lpShieldGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Parking "P" Spine */}
              <path
                d="M17 14V33"
                stroke="url(#lpShieldGrad)"
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Parking "P" Upper Loop */}
              <path
                d="M17 14H25.5C28.5 14 31 16.5 31 19.5C31 22.5 28.5 25 25.5 25H17"
                stroke="url(#lpShieldGrad)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Digital Checkmark (Official / Verified Report) */}
              <path
                d="M23 27L28 32L36 21"
                stroke="url(#lpCheckGrad)"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="anim-checkmark-glow"
              />

              {/* Central Pulsing Tech Dot */}
              <circle
                cx="24"
                cy="19.5"
                r="1.8"
                fill="#00ffcc"
                className="anim-checkmark-glow"
              />
            </svg>

            {/* Corner Sparkle / Lens Reflection */}
            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white/80 blur-[0.5px]" />
          </div>
        </div>
      </div>

      {/* Optional Typography Lockup */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h1 className={`${currentSize.textTitle} font-extrabold text-slate-800 tracking-tight leading-tight flex items-center gap-1`}>
              <span>Lapor</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                Park
              </span>
            </h1>
          </div>
          <p className={`${currentSize.textSub} text-slate-500 font-medium tracking-wide`}>
            Berita Acara Digital
          </p>
        </div>
      )}
    </div>
  );
}
