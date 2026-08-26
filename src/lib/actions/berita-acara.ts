"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { CreateBAPayload, UpdateBAPayload, StatusBA } from "@/lib/types";

/**
 * Generate the next sequential BA number: BA/PARKIR/YYYY/MM/xxxx
 */
async function generateNomorBA(): Promise<string> {
  const supabase = await createClient();
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const prefix = `BA/PARKIR/${year}/${month}/`;

  // Find the latest BA number for this month
  const { data } = await supabase
    .from("berita_acara")
    .select("nomor_ba")
    .like("nomor_ba", `${prefix}%`)
    .order("nomor_ba", { ascending: false })
    .limit(1);

  let sequence = 1;
  if (data && data.length > 0) {
    const lastNum = data[0].nomor_ba;
    const lastSeq = parseInt(lastNum.split("/").pop() ?? "0", 10);
    sequence = lastSeq + 1;
  }

  return `${prefix}${String(sequence).padStart(4, "0")}`;
}

/**
 * Create a new Berita Acara.
 */
export async function createBeritaAcara(payload: CreateBAPayload) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tidak terautentikasi." };

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const nomorBA = await generateNomorBA();

  // Set initial status based on role
  let initialStatus: StatusBA = "menunggu_review";
  if (profile?.role === "carpark_manager") {
    initialStatus = "diperiksa";
  } else if (profile?.role === "supervisor") {
    initialStatus = "disetujui";
  }

  const { data, error } = await supabase
    .from("berita_acara")
    .insert({
      nomor_ba: nomorBA,
      tanggal_kejadian: payload.tanggal_kejadian,
      waktu_kejadian: payload.waktu_kejadian,
      lokasi_zona: payload.lokasi_zona,
      jenis_insiden: payload.jenis_insiden,
      pihak_terlibat: payload.pihak_terlibat || null,
      judul_masalah: payload.judul_masalah,
      kronologi: payload.kronologi,
      tindakan_dilakukan: payload.tindakan_dilakukan,
      penyelesaian: payload.penyelesaian,
      mitigasi: payload.mitigasi,
      lampiran_foto: payload.lampiran_foto ?? [],
      status: initialStatus,
      dibuat_oleh: user.id,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating BA:", error);
    return { error: "Gagal membuat Berita Acara. " + error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/berita-acara");
  redirect(`/berita-acara/${data.id}`);
}

/**
 * Update an existing Berita Acara (Manager/Supervisor only).
 * Records each changed field in the audit log.
 */
export async function updateBeritaAcara(
  baId: string,
  payload: UpdateBAPayload
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tidak terautentikasi." };

  // Verify user role
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    !profile ||
    (profile.role !== "carpark_manager" && profile.role !== "supervisor")
  ) {
    return { error: "Anda tidak memiliki izin untuk mengedit BA." };
  }

  // Get current BA data for audit log comparison
  const { data: currentBA } = await supabase
    .from("berita_acara")
    .select("*")
    .eq("id", baId)
    .single();

  if (!currentBA) return { error: "Berita Acara tidak ditemukan." };

  // Determine which fields actually changed
  const auditEntries: {
    ba_id: string;
    user_id: string;
    field_changed: string;
    old_value: string | null;
    new_value: string | null;
  }[] = [];

  const fields = Object.keys(payload) as (keyof UpdateBAPayload)[];
  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

  for (const field of fields) {
    const newValue = payload[field];
    if (newValue === undefined) continue;

    const oldValue = currentBA[field];
    if (String(oldValue) !== String(newValue)) {
      auditEntries.push({
        ba_id: baId,
        user_id: user.id,
        field_changed: field,
        old_value: oldValue != null ? String(oldValue) : null,
        new_value: String(newValue),
      });
      updateData[field] = newValue;
    }
  }

  // Set the reviewer
  updateData.direview_oleh = user.id;

  // Update the BA
  const { error: updateError } = await supabase
    .from("berita_acara")
    .update(updateData)
    .eq("id", baId);

  if (updateError) {
    console.error("Error updating BA:", updateError);
    return { error: "Gagal mengupdate Berita Acara." };
  }

  // Insert audit log entries
  if (auditEntries.length > 0) {
    const { error: auditError } = await supabase
      .from("ba_audit_log")
      .insert(auditEntries);

    if (auditError) {
      console.error("Error inserting audit log:", auditError);
      // Non-fatal: BA was updated, but audit failed
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/berita-acara");
  revalidatePath(`/berita-acara/${baId}`);
  redirect(`/berita-acara/${baId}`);
}

/**
 * Delete a Berita Acara (Supervisor only).
 */
export async function deleteBeritaAcara(baId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tidak terautentikasi." };

  // Verify supervisor role
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "supervisor") {
    return { error: "Hanya Supervisor yang dapat menghapus BA." };
  }

  const { error } = await supabase
    .from("berita_acara")
    .delete()
    .eq("id", baId);

  if (error) {
    console.error("Error deleting BA:", error);
    return { error: "Gagal menghapus Berita Acara." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/berita-acara");
  redirect("/berita-acara");
}

/**
 * Updates the status of a Berita Acara
 * Incorporates role-based workflow logic
 */
export async function updateStatusBAAction(id: string, newStatus: StatusBA) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) return { error: "Tidak terautentikasi." };

    // Get current profile
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", authUser.id)
      .single();

    if (!profile) return { error: "Profil tidak ditemukan." };

    // Verify permissions for status transition
    if (newStatus === "diperiksa" && profile.role !== "carpark_manager") {
      return { error: "Hanya Carpark Manager yang dapat menandai telah diperiksa." };
    }

    if (newStatus === "disetujui" && profile.role !== "supervisor") {
      return { error: "Hanya Supervisor yang dapat menyetujui." };
    }

    if (newStatus === "revisi" && profile.role === "team_leader") {
      return { error: "Anda tidak berhak meminta revisi." };
    }

    // Get old BA to log changes
    const { data: oldBA } = await supabase
      .from("berita_acara")
      .select("status")
      .eq("id", id)
      .single();

    if (!oldBA) return { error: "BA tidak ditemukan." };
    if (oldBA.status === newStatus) return { success: true }; // No change

    // Update the BA
    const { error: updateError } = await supabase
      .from("berita_acara")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
        direview_oleh: authUser.id,
      })
      .eq("id", id);

    if (updateError) throw updateError;

    // Log the status change
    await supabase.from("ba_audit_log").insert({
      ba_id: id,
      user_id: authUser.id,
      field_changed: "status",
      old_value: oldBA.status,
      new_value: newStatus,
    });

    revalidatePath(`/berita-acara/${id}`);
    revalidatePath("/berita-acara");
    
    return { success: true };
  } catch (err: unknown) {
    console.error("Update status error:", err);
    return {
      error: err instanceof Error ? err.message : "Terjadi kesalahan sistem.",
    };
  }
}
