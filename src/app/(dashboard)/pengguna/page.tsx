import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { ROLE_LABELS } from "@/lib/types";
import BandaraFilter from "@/components/bandara-filter";
import { CreateUserModal, DeleteUserButton, UpdatePasswordButton, UpdateUserButton, PasswordCell } from "./client-components";
import { ShieldAlert, Mail, User as UserIcon, KeyRound } from "lucide-react";

export default async function PenggunaPage({
  searchParams,
}: {
  searchParams: Promise<{ bandara?: string }>;
}) {
  const params = await searchParams;
  const bandaraFilter = params.bandara;
  const supabase = await createClient();

  // 1. Authenticate & Authorize
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role, kode_bandara")
    .eq("id", currentUser.id)
    .single();

  if (!profile || (profile.role !== "supervisor" && profile.role !== "superadmin")) {
    // Only supervisors and admins can access this page
    redirect("/berita-acara");
  }

  // 2. Fetch users from public.users and auth metadata
  const adminClient = createAdminClient();
  let dbUsersQuery = supabase.from("users").select("*").order("nama", { ascending: true });
  
  if (profile.role !== "superadmin") {
    dbUsersQuery = dbUsersQuery.eq("kode_bandara", profile.kode_bandara);
  } else if (bandaraFilter && bandaraFilter !== "ALL") {
    dbUsersQuery = dbUsersQuery.eq("kode_bandara", bandaraFilter);
  }

  const [{ data: dbUsers, error }, { data: authData }] = await Promise.all([
    dbUsersQuery,
    adminClient.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  if (error) {
    console.error("Error fetching users:", error);
  }

  const authMap = new Map(
    authData?.users?.map((u) => [u.id, (u.user_metadata?.password_display as string) || null]) || []
  );

  const users = (dbUsers || []).map((u) => ({
    ...u,
    password_display: authMap.get(u.id) || null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-slate-800 truncate">Manajemen Pengguna</h1>
          <p className="text-sm text-slate-500 mt-1 truncate">
            Kelola akses dan akun anggota tim Lapor Park
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
          {profile.role === "superadmin" && (
            <div className="w-full sm:w-[320px]">
              <BandaraFilter userRole={profile.role} />
            </div>
          )}
          <div className="w-full sm:w-auto">
            <CreateUserModal />
          </div>
        </div>
      </div>

      <div className="neo-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)] text-center">
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                  Pengguna
                </th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                  Kata Sandi
                </th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                  Bandara
                </th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                  Hak Akses (Role)
                </th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {users && users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center shrink-0">
                          <UserIcon className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <span className="font-medium text-slate-800 text-center">{u.nama}</span>
                          {u.id === currentUser.id && (
                            <span className="mt-1 px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-medium border border-indigo-500/20 shrink-0">
                              Anda
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-500">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <PasswordCell password={u.password_display} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-600 text-[11px] font-medium border border-slate-200 dark:border-white/[0.08]">
                        {u.kode_bandara === "ALL" ? "Pusat (HO)" : (u.kode_bandara || "BDJ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border
                        ${u.role === 'superadmin' ? 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20' : ''}
                        ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' : ''}
                        ${u.role === 'supervisor' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : ''}
                        ${u.role === 'carpark_manager' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' : ''}
                        ${u.role === 'team_leader' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' : ''}
                        ${u.role === 'teknisi' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : ''}
                      `}>
                        {u.role === 'supervisor' && <ShieldAlert className="w-3 h-3" />}
                        {ROLE_LABELS[u.role as keyof typeof ROLE_LABELS]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <UpdateUserButton userId={u.id} currentName={u.nama} currentEmail={u.email} currentSignatureUrl={u.signature_url} />
                        <UpdatePasswordButton userId={u.id} userName={u.nama} />
                        {u.id !== currentUser.id && (
                          <DeleteUserButton userId={u.id} userName={u.nama} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
