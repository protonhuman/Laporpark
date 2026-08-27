import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import StatusBadge from "@/components/status-badge";
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
} from "lucide-react";

const PAGE_SIZE = 10;

export default async function BeritaAcaraListPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    status?: string;
    jenis?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const statusFilter = params.status as StatusBA | undefined;
  const jenisFilter = params.jenis as JenisInsiden | undefined;
  const searchQuery = params.q ?? "";

  const supabase = await createClient();

  // Build query
  let query = supabase
    .from("berita_acara")
    .select(
      "*, pembuat:users!berita_acara_dibuat_oleh_fkey(nama)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

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
    const merged = { page: String(page), status: statusFilter, jenis: jenisFilter, q: searchQuery, ...overrides };
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
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-slate-800 text-sm font-medium hover:from-sky-400 hover:to-indigo-500 transition-all shadow-lg shadow-sky-500/20"
        >
          <FilePlus className="w-4 h-4" />
          Buat BA Baru
        </Link>
      </div>

      {/* Filters */}
      <div className="neo-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <form className="flex-1 relative" action="/berita-acara" method="GET">
            {statusFilter && (
              <input type="hidden" name="status" value={statusFilter} />
            )}
            {jenisFilter && (
              <input type="hidden" name="jenis" value={jenisFilter} />
            )}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              name="q"
              type="text"
              defaultValue={searchQuery}
              placeholder="Cari judul atau nomor BA..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-800 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
            />
          </form>

          {/* Status filter */}
          <div className="flex gap-2">
            <Link
              href={buildUrl({ status: undefined, page: "1" })}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                !statusFilter
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/20"
                  : "text-slate-500 hover:bg-white/[0.04] border border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)]"
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
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  statusFilter === value
                    ? "bg-sky-500/15 text-sky-400 border border-sky-500/20"
                    : "text-slate-500 hover:bg-white/[0.04] border border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="neo-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)] text-left">
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Nomor BA
                </th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Judul Masalah
                </th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Jenis
                </th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Dibuat Oleh
                </th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {items && items.length > 0 ? (
                items.map((ba) => (
                  <tr
                    key={ba.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/berita-acara/${ba.id}`}
                        className="font-mono text-xs text-sky-400 hover:text-sky-300"
                      >
                        {ba.nomor_ba}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/berita-acara/${ba.id}`}
                        className="text-slate-800 font-medium hover:text-sky-300 transition-colors"
                      >
                        {ba.judul_masalah}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {
                        JENIS_INSIDEN_LABELS[
                          ba.jenis_insiden as keyof typeof JENIS_INSIDEN_LABELS
                        ]
                      }
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ba.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {ba.pembuat?.nama ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
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
          <div className="px-6 py-4 border-t border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)] flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={buildUrl({ page: String(page - 1) })}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 border border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)] hover:bg-white/[0.04] transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Prev
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={buildUrl({ page: String(page + 1) })}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 border border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)] hover:bg-white/[0.04] transition-colors"
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
