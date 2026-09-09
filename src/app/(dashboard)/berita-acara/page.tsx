import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import StatusBadge from "@/components/status-badge";
import BandaraFilter from "@/components/bandara-filter";
import {
  JENIS_INSIDEN_LABELS,
  STATUS_LABELS,
  type StatusBA,
  type JenisInsiden,
} from "@/lib/types";
import {
  Search,
  FilePlus,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const PAGE_SIZE = 10;

export default async function BeritaAcaraListPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    status?: string;
    jenis?: string;
    bandara?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const statusFilter = params.status as StatusBA | undefined;
  const jenisFilter = params.jenis as JenisInsiden | undefined;
  const bandaraFilter = params.bandara;
  const searchQuery = params.q ?? "";

  const supabase = await createClient();

  // Get current user's kode_bandara for filtering
  const { data: { user: authUser } } = await supabase.auth.getUser();
  let userKodeBandara = "BDJ";
  let userRole = "team_leader";
  if (authUser) {
    const { data: profile } = await supabase
      .from("users")
      .select("role, kode_bandara")
      .eq("id", authUser.id)
      .single();
    if (profile) {
      userKodeBandara = profile.kode_bandara || "BDJ";
      userRole = profile.role;
    }
  }

  // Build query
  let query = supabase
    .from("berita_acara")
    .select(
      "*, pembuat:users!berita_acara_dibuat_oleh_fkey(nama)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  // Filter by user's airport (admin sees all)
  if (userRole !== "superadmin") {
    query = query.eq("kode_bandara", userKodeBandara);
  } else if (bandaraFilter && bandaraFilter !== "ALL") {
    query = query.eq("kode_bandara", bandaraFilter);
  }

  if (statusFilter) query = query.eq("status", statusFilter);
  if (jenisFilter) query = query.eq("jenis_insiden", jenisFilter);
  if (searchQuery) {
    query = query.or(
      `judul_masalah.ilike.%${searchQuery}%,nomor_ba.ilike.%${searchQuery}%`
    );
  }

  // Pagination
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data: items, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  // Helper to build URL with params
  function buildUrl(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    const merged = { page: String(page), status: statusFilter, jenis: jenisFilter, bandara: bandaraFilter, q: searchQuery, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v) p.set(k, v);
    }
    return `/berita-acara?${p.toString()}`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Daftar Berita Acara</h1>
          <p className="text-slate-500 text-sm mt-1">
            {count ?? 0} total laporan
          </p>
        </div>
        <Link
          href="/berita-acara/baru"
          className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-500/15 via-indigo-500/10 to-sky-500/15 dark:from-sky-500/25 dark:via-indigo-500/20 dark:to-sky-500/25 text-sky-700 dark:text-sky-300 border border-sky-500/30 dark:border-sky-400/30 shadow-[4px_4px_10px_var(--shadow-dark),-4px_-4px_10px_var(--shadow-light)] hover:shadow-[6px_6px_14px_var(--shadow-dark),-6px_-6px_14px_var(--shadow-light)] hover:border-sky-500/50 hover:from-sky-500/25 hover:to-indigo-500/25 active:scale-95 active:shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)] transition-all duration-200 cursor-pointer select-none"
        >
          <FilePlus className="w-4 h-4 text-sky-600 dark:text-sky-400 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-200" />
          <span>Buat BA Baru</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="neo-card p-4 sm:p-5 space-y-4">
        {/* Top: Airport Filter (Superadmin) + Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          {userRole === "superadmin" && (
            <div className="w-full sm:w-[260px] shrink-0">
              <BandaraFilter userRole={userRole} />
            </div>
          )}

          {/* Search Box */}
          <form className="flex-1 min-w-0" action="/berita-acara" method="GET">
            {statusFilter && (
              <input type="hidden" name="status" value={statusFilter} />
            )}
            {jenisFilter && (
              <input type="hidden" name="jenis" value={jenisFilter} />
            )}
            {bandaraFilter && (
              <input type="hidden" name="bandara" value={bandaraFilter} />
            )}
            <div className="relative w-full flex items-center">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                name="q"
                type="text"
                defaultValue={searchQuery}
                placeholder="Cari berdasarkan judul masalah atau nomor BA..."
                className="w-full pl-10 pr-24 py-2.5 rounded-xl neo-inset border border-slate-300/40 dark:border-white/[0.08] bg-transparent text-slate-800 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
              />
              {searchQuery && (
                <Link
                  href={buildUrl({ q: undefined, page: "1" })}
                  className="absolute right-16 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-md transition-colors"
                  title="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </Link>
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-500/20 text-sky-700 dark:text-sky-300 hover:bg-sky-500/30 active:scale-95 transition-all cursor-pointer"
              >
                Cari
              </button>
            </div>
          </form>
        </div>

        {/* Bottom: Status filter tabs */}
        <div className="pt-2 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Status:
          </span>
          <Link
            href={buildUrl({ status: undefined, page: "1" })}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
              !statusFilter
                ? "bg-sky-500/20 text-sky-700 dark:text-sky-300 font-semibold border border-sky-500/30 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/[0.05] border border-transparent shadow-[2px_2px_5px_var(--shadow-dark),-2px_-2px_5px_var(--shadow-light)] dark:shadow-none"
            }`}
          >
            Semua
          </Link>
          {(
            Object.entries(STATUS_LABELS) as [StatusBA, string][]
          ).map(([value, label]) => (
            <Link
              key={value}
              href={buildUrl({ status: value, page: "1" })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                statusFilter === value
                  ? "bg-sky-500/20 text-sky-700 dark:text-sky-300 font-semibold border border-sky-500/30 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/[0.05] border border-transparent shadow-[2px_2px_5px_var(--shadow-dark),-2px_-2px_5px_var(--shadow-light)] dark:shadow-none"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Card List (Phones) */}
      <div className="block md:hidden space-y-3">
        {items && items.length > 0 ? (
          items.map((ba) => (
            <Link
              key={ba.id}
              href={`/berita-acara/${ba.id}`}
              className="neo-card p-4 block hover:border-sky-500/30 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-sky-500 font-semibold">
                  {ba.nomor_ba}
                </span>
                <StatusBadge status={ba.status} />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2">
                {ba.judul_masalah}
              </h3>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60 dark:border-white/[0.06]">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04]">
                  {JENIS_INSIDEN_LABELS[ba.jenis_insiden as keyof typeof JENIS_INSIDEN_LABELS]}
                </span>
                <span>
                  {new Date(ba.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Oleh: <span className="text-slate-600 font-medium">{ba.pembuat?.nama ?? "—"}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="neo-card p-8 text-center text-slate-500 text-sm">
            Tidak ada Berita Acara ditemukan.
          </div>
        )}
      </div>

      {/* Desktop & Tablet Table */}
      <div className="hidden md:block neo-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-300/50 dark:border-white/[0.08] text-center">
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase text-center">
                  Nomor BA
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase text-center">
                  Judul Masalah
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase text-center">
                  Jenis
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase text-center">
                  Status
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase text-center">
                  Dibuat Oleh
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase text-center">
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-white/[0.04]">
              {items && items.length > 0 ? (
                items.map((ba) => (
                  <tr
                    key={ba.id}
                    className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/berita-acara/${ba.id}`}
                        className="font-mono text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 hover:underline"
                      >
                        {ba.nomor_ba}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/berita-acara/${ba.id}`}
                        className="text-slate-800 dark:text-slate-200 font-medium hover:text-sky-600 dark:hover:text-sky-400 transition-colors line-clamp-1"
                      >
                        {ba.judul_masalah}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-medium bg-slate-200/60 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-300/40 dark:border-white/[0.08] whitespace-nowrap shadow-sm">
                          {
                            JENIS_INSIDEN_LABELS[
                              ba.jenis_insiden as keyof typeof JENIS_INSIDEN_LABELS
                            ]
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <StatusBadge status={ba.status} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs text-center whitespace-nowrap">
                      {ba.pembuat?.nama ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs text-center whitespace-nowrap">
                      {new Date(ba.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Tidak ada Berita Acara ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-300/50 dark:border-white/[0.08] flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={buildUrl({ page: String(page - 1) })}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-200/50 dark:bg-white/[0.05] hover:bg-slate-300/50 dark:hover:bg-white/[0.1] active:scale-95 transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Prev
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={buildUrl({ page: String(page + 1) })}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-200/50 dark:bg-white/[0.05] hover:bg-slate-300/50 dark:hover:bg-white/[0.1] active:scale-95 transition-all"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
