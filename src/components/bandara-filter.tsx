"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { DAFTAR_BANDARA } from "@/lib/constants";
import { MapPin, ChevronDown, Check, Search } from "lucide-react";

export default function BandaraFilter({ userRole }: { userRole: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentBandara = searchParams.get("bandara") || "ALL";

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  if (userRole !== "superadmin") return null;

  const selectedBandara = DAFTAR_BANDARA.find((b) => b.kode === currentBandara);

  const handleSelect = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val === "ALL") {
      params.delete("bandara");
    } else {
      params.set("bandara", val);
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  // Recalculate popover position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 6,
      left: rect.left,
      width: Math.max(rect.width, 420),
    });
  }, []);

  // Open handler
  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
      setSearch("");
    }
    setIsOpen((prev) => !prev);
  };

  // Close on click outside, Escape, scroll, resize
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      )
        return;
      setIsOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    function handleScrollOrResize() {
      updatePosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  const filteredBandara = DAFTAR_BANDARA.filter(
    (b) =>
      b.kode.toLowerCase().includes(search.toLowerCase()) ||
      b.nama.toLowerCase().includes(search.toLowerCase()) ||
      b.lokasi.toLowerCase().includes(search.toLowerCase())
  );

  // Popover content (rendered via portal)
  const popoverContent = isOpen
    ? createPortal(
        <div
          ref={popoverRef}
          className="fixed z-[9999] animate-dropdown-in"
          style={{
            top: coords.top,
            left: coords.left,
            width: Math.min(coords.width, window.innerWidth - coords.left - 16),
            maxWidth: "95vw",
          }}
        >
          <div className="bg-white/97 dark:bg-slate-900/97 backdrop-blur-2xl border border-sky-200/80 dark:border-white/10 rounded-2xl shadow-[0_20px_40px_-8px_rgba(15,23,42,0.3),0_8px_16px_-4px_rgba(14,165,233,0.1)] py-2 overflow-hidden">
            {/* Search Input */}
            <div className="px-2.5 pb-2 border-b border-slate-100 dark:border-white/10">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari kode atau nama bandara..."
                  autoFocus
                  className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto px-1.5 pt-1 space-y-0.5">
              {/* Option: Semua Bandara */}
              {(!search ||
                "semua bandara pusat ho all".includes(
                  search.toLowerCase()
                )) && (
                <button
                  type="button"
                  onClick={() => handleSelect("ALL")}
                  className={`w-full flex items-center px-2.5 py-2 rounded-xl text-left transition-colors duration-150 cursor-pointer ${
                    currentBandara === "ALL"
                      ? "bg-sky-50 dark:bg-sky-500/10 text-sky-900 dark:text-sky-300 font-bold"
                      : "hover:bg-slate-100/80 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="w-11 h-5.5 flex items-center justify-center font-mono font-bold text-[11px] rounded bg-slate-200/90 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-white/10 shrink-0">
                    ALL
                  </span>
                  <span className="mx-2 text-slate-300 dark:text-slate-600 font-light shrink-0">
                    —
                  </span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate flex-1">
                    Semua Bandara (Pusat / HO)
                  </span>
                  {currentBandara === "ALL" && (
                    <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 ml-2" />
                  )}
                </button>
              )}

              {/* List Bandara */}
              {filteredBandara.map((b) => {
                const isSelected = currentBandara === b.kode;
                return (
                  <button
                    key={b.kode}
                    type="button"
                    onClick={() => handleSelect(b.kode)}
                    className={`w-full flex items-center px-2.5 py-2 rounded-xl text-left transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-sky-50 dark:bg-sky-500/10 text-sky-900 dark:text-sky-300 font-bold"
                        : "hover:bg-slate-100/80 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span
                      className={`w-11 h-5.5 flex items-center justify-center font-mono font-bold text-[11px] rounded border shrink-0 ${
                        isSelected
                          ? "bg-sky-500 text-white border-sky-600 shadow-sm"
                          : "bg-sky-100/80 dark:bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-200/80 dark:border-sky-500/25"
                      }`}
                    >
                      {b.kode}
                    </span>
                    <span className="mx-2 text-slate-300 dark:text-slate-600 font-light shrink-0">
                      —
                    </span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate flex-1">
                      {b.nama}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}

              {filteredBandara.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-400">
                  Tidak ada bandara yang cocok dengan &quot;{search}&quot;
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between pl-3.5 pr-4 py-2.5 rounded-xl border border-sky-500/30 bg-white/85 dark:bg-slate-900/80 backdrop-blur-md text-slate-800 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/50 cursor-pointer shadow-[0_8px_16px_-4px_rgba(14,165,233,0.15)] transition-all duration-200 hover:bg-white hover:border-sky-500/50 group overflow-hidden"
      >
        <div className="flex items-center gap-2.5 min-w-0 overflow-hidden flex-1">
          <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
          {currentBandara === "ALL" ? (
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              <span className="w-11 h-5.5 flex items-center justify-center font-mono font-bold text-[11px] rounded bg-slate-200/80 text-slate-700 border border-slate-300/80 shrink-0">
                ALL
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">
                Semua Bandara
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              <span className="w-11 h-5.5 flex items-center justify-center font-mono font-bold text-[11px] rounded bg-sky-100 text-sky-800 border border-sky-200 shrink-0">
                {currentBandara}
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">
                {selectedBandara?.nama || currentBandara}
              </span>
            </div>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-sky-500 shrink-0 ml-2 transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180 text-sky-600" : "group-hover:translate-y-0.5"
          }`}
        />
      </button>

      {popoverContent}
    </div>
  );
}
