"use client";

import { useState } from "react";
import { updateStatusBAAction } from "@/lib/actions/berita-acara";
import type { StatusBA } from "@/lib/types";
import { CheckCircle, Loader2, XCircle, ShieldAlert, CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApprovalActionsProps {
  baId: string;
  currentStatus: StatusBA;
  userRole: string;
}

export default function ApprovalActions({ baId, currentStatus, userRole }: ApprovalActionsProps) {
  const [loading, setLoading] = useState<StatusBA | null>(null);
  const router = useRouter();

  async function handleUpdate(newStatus: StatusBA) {
    setLoading(newStatus);
    const result = await updateStatusBAAction(baId, newStatus);
    if (result.error) {
      alert(result.error);
    }
    setLoading(null);
  }

  // Hide action bar entirely if it's already finished
  if (currentStatus === "selesai") return null;

  const isManager = userRole === "carpark_manager";
  const isSupervisor = userRole === "supervisor" || userRole === "admin";

  return (
    <div className="flex flex-wrap gap-2 items-center bg-white/[0.02] border border-white/[0.08] p-3 rounded-xl print:hidden">
      <span className="text-sm font-medium text-slate-500 mr-2">Tindakan:</span>
      
      {/* MANAGER ACTIONS */}
      {isManager && (currentStatus === "menunggu_review" || currentStatus === "revisi") && (
        <button
          onClick={() => handleUpdate("diperiksa")}
          disabled={loading !== null}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading === "diperiksa" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
          Tandai Telah Diperiksa
        </button>
      )}

      {/* SUPERVISOR ACTIONS */}
      {isSupervisor && (currentStatus === "menunggu_review" || currentStatus === "diperiksa" || currentStatus === "revisi") && (
        <>
          <button
            onClick={() => handleUpdate("disetujui")}
            disabled={loading !== null}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading === "disetujui" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Setujui Berita Acara
          </button>
        </>
      )}
      
      {isSupervisor && currentStatus === "disetujui" && (
        <button
          onClick={() => handleUpdate("selesai")}
          disabled={loading !== null}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading === "selesai" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          Tandai Selesai
        </button>
      )}

      {/* REJECT/REVISION ACTION - available to both Manager and Supervisor if it's not already in revision */}
      {(isManager || isSupervisor) && currentStatus !== "revisi" && (
        <button
          onClick={() => handleUpdate("revisi")}
          disabled={loading !== null}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading === "revisi" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
          Kembalikan untuk Revisi
        </button>
      )}
    </div>
  );
}
