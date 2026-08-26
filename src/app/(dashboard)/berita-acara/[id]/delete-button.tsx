"use client";

import { useState } from "react";
import { deleteBeritaAcara } from "@/lib/actions/berita-acara";
import ConfirmDialog from "@/components/confirm-dialog";
import { Trash2 } from "lucide-react";

export default function DeleteBAButton({ baId }: { baId: string }) {
  const [showDialog, setShowDialog] = useState(false);

  async function handleDelete() {
    await deleteBeritaAcara(baId);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowDialog(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Hapus
      </button>

      <ConfirmDialog
        open={showDialog}
        title="Hapus Berita Acara"
        message="Apakah Anda yakin ingin menghapus Berita Acara ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Hapus"
        onConfirm={handleDelete}
        onCancel={() => setShowDialog(false)}
      />
    </>
  );
}
