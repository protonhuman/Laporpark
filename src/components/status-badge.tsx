import type { StatusBA } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

const STATUS_STYLES: Record<StatusBA, string> = {
  draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  menunggu_review:
    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  revisi: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  disetujui: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  selesai: "bg-sky-500/10 text-sky-400 border-sky-500/20",
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
