import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/sidebar";
import type { User } from "@/lib/types";

/**
 * Dashboard route group layout.
 * Fetches authenticated user info and renders the sidebar + main content area.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  // Get user profile from our users table
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (!profile) {
    // User exists in auth but not in users table — edge case
    // Could happen if seed wasn't run. Show a helpful error.
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <div className="glass-card p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Profil Tidak Ditemukan
          </h2>
          <p className="text-slate-400 text-sm">
            Akun Anda belum terdaftar di tabel users. Hubungi administrator
            untuk menambahkan profil Anda.
          </p>
        </div>
      </div>
    );
  }

  const user: User = {
    id: profile.id,
    nama: profile.nama,
    email: profile.email,
    role: profile.role,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar user={user} />

      {/* Main content area */}
      <main className="lg:pl-64 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-6 pt-16 lg:pt-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
