import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import StatusBadge from "@/components/status-badge";
import type { StatusBA } from "@/lib/types";
import { STATUS_LABELS, JENIS_INSIDEN_LABELS } from "@/lib/types";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  FilePlus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const STATUS_ICONS: Record<StatusBA, typeof FileText> = {
  draft: FileText,
  menunggu_review: Clock,
  diperiksa: Clock,
  revisi: AlertTriangle,
  disetujui: CheckCircle2,
  selesai: FileCheck,
};

const STATUS_CARD_STYLES: Record<StatusBA, string> = {
  draft: "from-slate-500/20 to-slate-600/5",
  menunggu_review: "from-amber-500/20 to-amber-600/5",
  diperiksa: "from-blue-500/20 to-blue-600/5",
  revisi: "from-orange-500/20 to-orange-600/5",
  disetujui: "from-emerald-500/20 to-emerald-600/5",
  selesai: "from-sky-500/20 to-sky-600/5",
};

const STATUS_ICON_STYLES: Record<StatusBA, string> = {
  draft: "text-slate-400",
  menunggu_review: "text-amber-400",
  diperiksa: "text-blue-400",
  revisi: "text-orange-400",
  disetujui: "text-emerald-400",
  selesai: "text-sky-400",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // Count BA per status
  const statuses: StatusBA[] = [
    "diperiksa",
    "revisi",
    "selesai",
  ];
  const counts: Record<StatusBA, number> = {
    draft: 0,
    menunggu_review: 0,
    diperiksa: 0,
    revisi: 0,
    disetujui: 0,
    selesai: 0,
  };

  for (const status of statuses) {
    const { count } = await supabase
      .from("berita_acara")
      .select("*", { count: "exact", head: true })
      .eq("status", status);
    counts[status] = count ?? 0;
  }

  const totalBA = Object.values(counts).reduce((a, b) => a + b, 0);

  // Get 5 most recent BA with user info
  const { data: recentBA } = await supabase
    .from("berita_acara")
    .select("*, pembuat:users!berita_acara_dibuat_oleh_fkey(nama)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Ringkasan Berita Acara Parkir
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statuses.map((status) => {
          const Icon = STATUS_ICONS[status];
          return (
            <div
              key={status}
              className={`glass-card glass-card-hover p-5 bg-gradient-to-br ${STATUS_CARD_STYLES[status]}`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-5 h-5 ${STATUS_ICON_STYLES[status]}`} />
                <span className="text-2xl font-bold text-white">
                  {counts[status]}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {STATUS_LABELS[status]}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick actions + total */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Total card */}
        <div className="glass-card p-6 flex items-center gap-5 border border-[#00ffcc]/20">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00ffcc]/20 to-[#39ff14]/20">
            <TrendingUp className="w-7 h-7 text-[#00ffcc]" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{totalBA}</p>
            <p className="text-sm text-slate-400">Total Berita Acara</p>
          </div>
        </div>

        {/* Quick action: Buat BA Baru */}
        <Link
          href="/berita-acara/baru"
          className="glass-card glass-card-hover p-6 flex items-center gap-5 group"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#39ff14]/20 to-[#00ffcc]/20 group-hover:from-[#39ff14]/30 group-hover:to-[#00ffcc]/30 transition-all shadow-[0_0_15px_rgba(57,255,20,0.1)] group-hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]">
            <FilePlus className="w-7 h-7 text-[#39ff14]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              Buat Berita Acara Baru
            </p>
            <p className="text-xs text-slate-500">Laporkan insiden baru</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
        </Link>

        {/* Quick action: Lihat Semua */}
        <Link
          href="/berita-acara"
          className="glass-card glass-card-hover p-6 flex items-center gap-5 group"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff00ff]/20 to-[#00ffcc]/20 group-hover:from-[#ff00ff]/30 group-hover:to-[#00ffcc]/30 transition-all shadow-[0_0_15px_rgba(255,0,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]">
            <FileText className="w-7 h-7 text-[#ff00ff]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              Lihat Semua BA
            </p>
            <p className="text-xs text-slate-500">
              Daftar &amp; pencarian
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
        </Link>
      </div>

      {/* Recent BA */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">
            Berita Acara Terbaru
          </h2>
          <Link
            href="/berita-acara"
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
          >
            Lihat semua →
          </Link>
        </div>

        {recentBA && recentBA.length > 0 ? (
          <div className="divide-y divide-white/[0.04]">
            {recentBA.map((ba) => (
              <Link
                key={ba.id}
                href={`/berita-acara/${ba.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-500">
                      {ba.nomor_ba}
                    </span>
                    <StatusBadge status={ba.status} />
                  </div>
                  <p className="text-sm text-white truncate font-medium">
                    {ba.judul_masalah}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span>
                      {JENIS_INSIDEN_LABELS[ba.jenis_insiden as keyof typeof JENIS_INSIDEN_LABELS]}
                    </span>
                    <span>•</span>
                    <span>{ba.pembuat?.nama ?? "—"}</span>
                    <span>•</span>
                    <span>
                      {new Date(ba.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <FileText className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              Belum ada Berita Acara. Buat yang pertama!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
