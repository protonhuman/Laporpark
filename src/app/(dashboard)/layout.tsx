import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/sidebar";
import type { User } from "@/lib/types";

export const dynamic = "force-dynamic";

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

  // 1. First attempt: Get user profile using standard client
  let profile: User | null = null;
  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  if (userProfile) {
    profile = userProfile as User;
  } else {
    // 2. Fallback attempt using Admin Client (bypasses RLS & cookie/token propagation timing right after login)
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabaseAdmin = createAdminClient();
    const { data: adminProfile } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (adminProfile) {
      profile = adminProfile as User;
    } else {
      // 3. Profile genuinely doesn't exist in public.users yet — auto-create using upsert
      const role = (authUser.user_metadata?.role as User["role"]) || "team_leader";
      const newProfile: User = {
        id: authUser.id,
        nama: authUser.user_metadata?.nama || authUser.email?.split("@")[0] || "User",
        email: authUser.email || "",
        role: role,
      };

      const { data: upsertedProfile, error: upsertError } = await supabaseAdmin
        .from("users")
        .upsert(newProfile, { onConflict: "id" })
        .select()
        .single();

      if (upsertError) {
        console.error("Gagal menyinkronkan profil user:", upsertError);
        return (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="neo-card p-8 max-w-md text-center">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Profil Tidak Ditemukan
              </h2>
              <p className="text-slate-500 text-sm">
                Gagal menyinkronkan profil. Silakan hubungi administrator.
              </p>
            </div>
          </div>
        );
      }

      profile = (upsertedProfile as User) || newProfile;
    }
  }

  if (!profile) {
    redirect("/login");
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
      <main className="lg:pl-64 min-h-screen print:pl-0 print:min-h-0">
        <div className="px-4 sm:px-6 lg:px-8 py-6 pt-16 lg:pt-6 max-w-7xl print:p-0 print:m-0">
          {children}
        </div>
      </main>
    </div>
  );
}
