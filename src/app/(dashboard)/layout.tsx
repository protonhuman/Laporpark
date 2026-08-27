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

  // Get user profile from our users table
  let { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (!profile) {
    // Attempt to auto-create missing user using service role key
    const { createClient: createAdminClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const newProfile = {
      id: authUser.id,
      nama: authUser.user_metadata?.nama || authUser.email?.split("@")[0] || "User",
      email: authUser.email,
      role: authUser.user_metadata?.role || "team_leader",
    };
    
    const { error: insertError } = await supabaseAdmin.from("users").insert(newProfile);

    if (insertError) {
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
    
    profile = newProfile;
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
