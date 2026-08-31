// ============================================================
// Lapor Park — Type Definitions
// Mirrors the Supabase/Postgres schema from migrations
// ============================================================

export type UserRole = "admin" | "supervisor" | "carpark_manager" | "team_leader" | "teknisi";

export type JenisInsiden =
  | "kerusakan_kendaraan"
  | "sengketa"
  | "komplain"
  | "kehilangan"
  | "gangguan_sistem"
  | "gangguan_perangkat"
  | "lainnya";

export type StatusBA =
  | "draft"
  | "menunggu_review"
  | "diperiksa"
  | "revisi"
  | "disetujui"
  | "selesai";

export interface User {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  signature_url?: string | null;
}

export interface BeritaAcara {
  id: string;
  nomor_ba: string;
  tanggal_kejadian: string; // ISO date string
  waktu_kejadian: string; // HH:mm:ss
  lokasi_zona: string;
  jenis_insiden: JenisInsiden;
  pihak_terlibat: string | null;
  judul_masalah: string;
  kronologi: string;
  tindakan_dilakukan: string;
  penyelesaian: string;
  mitigasi: string;
  lampiran_foto: string[] | null;
  status: StatusBA;
  dibuat_oleh: string; // FK → users.id
  direview_oleh: string | null; // FK → users.id
  created_at: string;
  updated_at: string;
}

/** Joined version with user names resolved */
export interface BeritaAcaraWithUsers extends BeritaAcara {
  pembuat?: User;
  reviewer?: User;
}

export interface AuditLog {
  id: string;
  ba_id: string;
  user_id: string;
  field_changed: string;
  old_value: string | null;
  new_value: string | null;
  changed_at: string;
}

export interface AuditLogWithUser extends AuditLog {
  user?: User;
}

// ---- Form / Action payloads ----

export interface CreateBAPayload {
  tanggal_kejadian: string;
  waktu_kejadian: string;
  lokasi_zona: string;
  jenis_insiden: JenisInsiden;
  pihak_terlibat?: string;
  judul_masalah: string;
  kronologi: string;
  tindakan_dilakukan: string;
  penyelesaian: string;
  mitigasi: string;
  lampiran_foto?: string[];
}

export interface UpdateBAPayload {
  judul_masalah?: string;
  kronologi?: string;
  tindakan_dilakukan?: string;
  penyelesaian?: string;
  mitigasi?: string;
  pihak_terlibat?: string;
  lokasi_zona?: string;
  status?: StatusBA;
  lampiran_foto?: string[];
}

// ---- UI helpers ----

export const STATUS_LABELS: Record<StatusBA, string> = {
  draft: "Draft",
  menunggu_review: "Menunggu Review",
  diperiksa: "Diperiksa",
  revisi: "Revisi",
  disetujui: "Diketahui",
  selesai: "Selesai",
} as const;

export const JENIS_INSIDEN_LABELS: Record<JenisInsiden, string> = {
  kerusakan_kendaraan: "Kerusakan Kendaraan",
  sengketa: "Sengketa",
  komplain: "Komplain",
  kehilangan: "Kehilangan",
  gangguan_sistem: "Gangguan Sistem",
  gangguan_perangkat: "Gangguan Perangkat",
  lainnya: "Lainnya",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  supervisor: "Supervisor",
  carpark_manager: "Carpark Manager",
  team_leader: "Team Leader",
  teknisi: "Teknisi",
};
