"use client";

import { Printer } from "lucide-react";

export default function PDFButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm font-medium text-slate-800 hover:bg-white/[0.1] hover:text-sky-400 hover:border-sky-500/30 transition-all print:hidden"
    >
      <Printer className="w-3.5 h-3.5" />
      Cetak / PDF
    </button>
  );
}
