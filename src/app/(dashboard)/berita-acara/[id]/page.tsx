import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/status-badge";
import DeleteBAButton from "./delete-button";
import ApprovalActions from "./approval-actions";
import PDFButton from "./pdf-button";
import PrintLayout from "./print-layout";
import {
  JENIS_INSIDEN_LABELS,
  ROLE_LABELS,
  STATUS_LABELS,
  type AuditLogWithUser,
  type StatusBA,
} from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Users,
  Pencil,
  History,
  ImageIcon,
} from "lucide-react";

export default async function BeritaAcaraDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Get BA with user info
  const { data: ba } = await supabase
    .from("berita_acara")
    .select(
      `*, 
       pembuat:users!berita_acara_dibuat_oleh_fkey(id, nama, role, signature_url),
       reviewer:users!berita_acara_direview_oleh_fkey(id, nama, role, signature_url)`
    )
    .eq("id", id)
    .single();

  if (!ba) notFound();

  // Get audit log
  const { data: auditLogs } = await supabase
    .from("ba_audit_log")
    .select("*, user:users(nama, role, signature_url)")
    .eq("ba_id", id)
    .order("changed_at", { ascending: false });

  // Get current user role for permission checks
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  const { data: currentProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", authUser!.id)
    .single();

  const canEdit =
    (currentProfile?.role === "carpark_manager" ||
    currentProfile?.role === "supervisor") && 
    (ba.status !== "disetujui" && ba.status !== "selesai");
  const canDelete = currentProfile?.role === "supervisor";

  // Determine Checker and Approver from logs and creator role
  let checker: { nama: string; date: string; signature_url?: string | null } | null = null;
  let approver: { nama: string; date: string; signature_url?: string | null } | null = null;

  if (ba.pembuat?.role === "carpark_manager") {
    checker = { nama: ba.pembuat.nama, date: ba.created_at, signature_url: ba.pembuat.signature_url };
  } else if (ba.pembuat?.role === "supervisor") {
    approver = { nama: ba.pembuat.nama, date: ba.created_at, signature_url: ba.pembuat.signature_url };
  }

  // Scan logs from oldest to newest to find who checked/approved
  const chronologicalLogs = [...(auditLogs || [])].reverse();
  chronologicalLogs.forEach((log) => {
    if (log.field_changed === "status") {
      if (log.new_value === "diperiksa") {
        checker = { nama: log.user?.nama ?? "Manager", date: log.changed_at, signature_url: log.user?.signature_url };
      }
      if (log.new_value === "disetujui") {
        approver = { nama: log.user?.nama ?? "Supervisor", date: log.changed_at, signature_url: log.user?.signature_url };
      }
    }
  });

  // Build field labels map
  const FIELD_LABELS: Record<string, string> = {
    judul_masalah: "Judul Masalah",
    kronologi: "Kronologi",
    tindakan_dilakukan: "Tindakan Dilakukan",
    penyelesaian: "Penyelesaian",
    mitigasi: "Mitigasi",
    pihak_terlibat: "Pihak Terlibat",
    lokasi_zona: "Lokasi/Zona",
    status: "Status",
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6 print:hidden">
        {/* Action Bar for Manager/Supervisor */}
      <ApprovalActions baId={id} currentStatus={ba.status} userRole={currentProfile?.role ?? ""} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <Link
          href="/berita-acara"
          className="p-2 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-slate-400 hover:text-white transition-all self-start print:hidden"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-mono text-slate-500">
              {ba.nomor_ba}
            </span>
            <StatusBadge status={ba.status} />
          </div>
          <h1 className="text-2xl font-bold text-white">{ba.judul_masalah}</h1>
        </div>
        <div className="flex gap-2 print:hidden">
          {(ba.status === "disetujui" || ba.status === "selesai") && (
            <PDFButton />
          )}
          {canEdit && (
            <Link
              href={`/berita-acara/${id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm font-medium text-white hover:bg-white/[0.08] transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Link>
          )}
          {canDelete && <DeleteBAButton baId={id} />}
        </div>
      </div>

      {/* Meta info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-xs">Tanggal</span>
          </div>
          <p className="text-sm text-white font-medium">
            {new Date(ba.tanggal_kejadian).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">Waktu</span>
          </div>
          <p className="text-sm text-white font-medium">{ba.waktu_kejadian}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs">Lokasi</span>
          </div>
          <p className="text-sm text-white font-medium">{ba.lokasi_zona}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span className="text-xs">Jenis</span>
          </div>
          <p className="text-sm text-white font-medium">
            {JENIS_INSIDEN_LABELS[ba.jenis_insiden as keyof typeof JENIS_INSIDEN_LABELS]}
          </p>
        </div>
      </div>

      {/* Pihak terlibat */}
      {ba.pihak_terlibat && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Pihak Terlibat
            </span>
          </div>
          <p className="text-sm text-slate-300">{ba.pihak_terlibat}</p>
        </div>
      )}

      {/* Detail sections */}
      <div className="space-y-4">
        {[
          { label: "Kronologi", content: ba.kronologi },
          { label: "Tindakan yang Dilakukan", content: ba.tindakan_dilakukan },
          { label: "Penyelesaian", content: ba.penyelesaian },
          { label: "Mitigasi", content: ba.mitigasi },
        ].map((section) => (
          <div key={section.label} className="glass-card p-5">
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">
              {section.label}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* Foto lampiran */}
      {ba.lampiran_foto && ba.lampiran_foto.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <ImageIcon className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Lampiran Foto
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ba.lampiran_foto.map((url: string, i: number) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl overflow-hidden border border-white/[0.08] aspect-video bg-white/[0.02] hover:border-sky-500/30 transition-colors"
              >
                <img
                  src={url}
                  alt={`Lampiran ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Personnel info */}
      <div className="glass-card p-5 print:hidden">
        <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">
          Informasi Pelapor
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Dibuat oleh</p>
            <p className="text-white font-medium">
              {ba.pembuat?.nama ?? "—"}
              {ba.pembuat?.role && (
                <span className="text-slate-500 font-normal ml-1">
                  ({ROLE_LABELS[ba.pembuat.role as keyof typeof ROLE_LABELS]})
                </span>
              )}
            </p>
            <p className="text-slate-600 text-xs mt-0.5">
              {new Date(ba.created_at).toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Diperiksa oleh</p>
            <p className="text-white font-medium">
              {checker ? checker.nama : <span className="text-slate-500 italic">Belum diperiksa</span>}
              {checker && (
                <span className="text-slate-500 font-normal ml-1">
                  (Carpark Manager)
                </span>
              )}
            </p>
            {checker && (
              <p className="text-slate-600 text-xs mt-0.5">
                {new Date(checker.date).toLocaleString("id-ID")}
              </p>
            )}
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Mengetahui</p>
            <p className="text-white font-medium">
              {approver ? approver.nama : <span className="text-slate-500 italic">Belum disetujui</span>}
              {approver && (
                <span className="text-slate-500 font-normal ml-1">
                  (Supervisor)
                </span>
              )}
            </p>
            {approver && (
              <p className="text-slate-600 text-xs mt-0.5">
                {new Date(approver.date).toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Audit log (Hidden in print) */}
      <div className="glass-card overflow-hidden print:hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-white">Riwayat Perubahan</h3>
        </div>

        {auditLogs && auditLogs.length > 0 ? (
          <div className="divide-y divide-white/[0.04]">
            {auditLogs.map((log: AuditLogWithUser & { user?: { nama: string; role: string; signature_url?: string } }) => (
              <div key={log.id} className="px-5 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-white">
                    {log.user?.nama ?? "—"}
                  </span>
                  <span className="text-xs text-slate-600">mengubah</span>
                  <span className="text-xs font-medium text-sky-400">
                    {FIELD_LABELS[log.field_changed] ?? log.field_changed}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 text-xs">
                  {log.old_value && (
                    <div className="flex-1 px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-300/80 line-through truncate">
                      {log.field_changed === "status" ? STATUS_LABELS[log.old_value as StatusBA] ?? log.old_value : log.old_value}
                    </div>
                  )}
                  <div className="flex-1 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-300/80 truncate">
                    {log.field_changed === "status" ? STATUS_LABELS[log.new_value as StatusBA] ?? log.new_value : log.new_value}
                  </div>
                </div>
                <p className="text-[10px] text-slate-600 mt-1">
                  {new Date(log.changed_at).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8 text-center text-sm text-slate-600">
            Belum ada perubahan tercatat.
          </div>
        )}
      </div>
      </div>

      {/* Print Layout Component (Hidden on web, visible only in print) */}
      <PrintLayout ba={ba} checker={checker} approver={approver} />
    </>
  );
}
