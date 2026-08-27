import type { StatusBA } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

const STATUS_STYLES: Record<StatusBA, string> = {
  draft: "bg-slate-500/10 text-slate-500 border-slate-500/20 shadow-[0_0_8px_rgba(148,163,184,0.15)]",
  menunggu_review: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.15)]",
  diperiksa: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.15)]",
  revisi: "bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_8px_rgba(249,115,22,0.15)]",
  disetujui: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.15)]",
  selesai: "bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-[0_0_8px_rgba(14,165,233,0.15)]",
};

export default function StatusBadge({ status }: { status: StatusBA }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
