"use server";

import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// Type for the payload
export interface CreateUserPayload {
  email: string;
  nama: string;
  password?: string;
  role: "team_leader" | "carpark_manager" | "supervisor" | "teknisi";
  signature_url?: string;
}

/**
 * Creates a new user via Supabase Auth Admin API
 * Restricted to supervisor role
 */
export async function createUserAction(payload: CreateUserPayload) {
  try {
    // 1. Verify current user is a supervisor
    const supabase = await createServerClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) return { error: "Tidak terautentikasi." };

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (!profile || profile.role !== "supervisor") {
      return { error: "Akses ditolak. Hanya supervisor yang dapat membuat pengguna baru." };
    }

    // 2. Create the user using admin client
    const adminClient = createAdminClient();
    const passwordToUse = payload.password || "password123";

    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email: payload.email,
      password: passwordToUse,
      email_confirm: true,
      user_metadata: {
        nama: payload.nama,
        role: payload.role,
        signature_url: payload.signature_url || null,
      },
    });

    if (createError) {
      console.error("Auth Admin Error:", createError);
      return { error: `Gagal membuat pengguna: ${createError.message}` };
    }

    // 3. Immediately upsert profile into public.users to ensure it exists right away
    if (newUser?.user) {
      const { error: profileError } = await adminClient.from("users").upsert(
        {
          id: newUser.user.id,
          nama: payload.nama,
          email: payload.email,
          role: payload.role,
          signature_url: payload.signature_url || null,
        },
        { onConflict: "id" }
      );

      if (profileError) {
        console.error("Failed to insert user profile into public.users:", profileError);
      }
    }
    
    revalidatePath("/pengguna");
    return { success: true };
  } catch (err: unknown) {
    console.error("Create User Exception:", err);
    return {
      error: err instanceof Error ? err.message : "Terjadi kesalahan sistem.",
    };
  }
}

/**
 * Deletes a user via Supabase Auth Admin API
 * Restricted to supervisor role
 */
export async function deleteUserAction(userId: string) {
  try {
    // 1. Verify current user is a supervisor
    const supabase = await createServerClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) return { error: "Tidak terautentikasi." };
    if (currentUser.id === userId) return { error: "Anda tidak dapat menghapus akun Anda sendiri." };

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (!profile || profile.role !== "supervisor") {
      return { error: "Akses ditolak. Hanya supervisor yang dapat menghapus pengguna." };
    }

    // 2. Delete the user using admin client
    const adminClient = createAdminClient();
    
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Auth Admin Delete Error:", deleteError);
      return { error: `Gagal menghapus pengguna: ${deleteError.message}` };
    }

    revalidatePath("/pengguna");
    return { success: true };
  } catch (err: unknown) {
    console.error("Delete User Exception:", err);
    return {
      error: err instanceof Error ? err.message : "Terjadi kesalahan sistem.",
    };
  }
}

/**
 * Updates a user's password via Supabase Auth Admin API
 * Restricted to supervisor role
 */
export async function updateUserPasswordAction(userId: string, newPassword: string) {
  try {
    // 1. Verify current user is a supervisor
    const supabase = await createServerClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) return { error: "Tidak terautentikasi." };

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (!profile || profile.role !== "supervisor") {
      return { error: "Akses ditolak. Hanya supervisor yang dapat mengubah password pengguna." };
    }

    if (newPassword.length < 6) {
      return { error: "Password harus memiliki minimal 6 karakter." };
    }

    // 2. Update the user using admin client
    const adminClient = createAdminClient();
    
    const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, {
      password: newPassword
    });

    if (updateError) {
      console.error("Auth Admin Update Password Error:", updateError);
      return { error: `Gagal mengubah password: ${updateError.message}` };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("Update Password Exception:", err);
    return {
      error: err instanceof Error ? err.message : "Terjadi kesalahan sistem.",
    };
  }
}

/**
 * Updates a user's name and/or email
 * Restricted to supervisor role
 */
export async function updateUserAction(userId: string, newName: string, newEmail: string, newSignatureUrl?: string) {
  try {
    // 1. Verify current user is a supervisor
    const supabase = await createServerClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) return { error: "Tidak terautentikasi." };

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (!profile || profile.role !== "supervisor") {
      return { error: "Akses ditolak. Hanya supervisor yang dapat mengubah profil pengguna." };
    }

    if (!newName.trim() || !newEmail.trim()) {
      return { error: "Nama dan Email tidak boleh kosong." };
    }

    // 2. Update the user using admin client (to bypass RLS)
    const adminClient = createAdminClient();
    
    // Update public.users table
    const { error: dbError } = await adminClient
      .from("users")
      .update({ 
        nama: newName.trim(),
        email: newEmail.trim(),
        ...(newSignatureUrl !== undefined && { signature_url: newSignatureUrl }),
      })
      .eq("id", userId);

    if (dbError) {
      console.error("DB Update Profile Error:", dbError);
      return { error: `Gagal mengubah profil di database: ${dbError.message}` };
    }

    // Update auth metadata and email as well to keep it in sync
    const { error: authError } = await adminClient.auth.admin.updateUserById(userId, {
      email: newEmail.trim(),
      email_confirm: true, // Auto confirm so user doesn't get locked out if email confirmation is required
      user_metadata: { 
        nama: newName.trim(),
        ...(newSignatureUrl !== undefined && { signature_url: newSignatureUrl })
      }
    });

    if (authError) {
      console.error("Auth Admin Update Profile Error:", authError);
      // Even if this fails, the public DB was updated, but we should inform the user
      return { error: `Gagal mengubah email autentikasi: ${authError.message}` };
    }

    revalidatePath("/", "layout"); // Memastikan semua cache BA ikut terhapus
    return { success: true };
  } catch (err: unknown) {
    console.error("Update Profile Exception:", err);
    return {
      error: err instanceof Error ? err.message : "Terjadi kesalahan sistem.",
    };
  }
}

