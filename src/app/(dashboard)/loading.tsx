export default function DashboardLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse" aria-busy="true" aria-label="Memuat data halaman...">
      {/* Top glowing indeterminate progress line */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[2.5px] bg-transparent overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="h-full w-full bg-gradient-to-r from-emerald-400 via-[#00ffcc] to-sky-400 animate-progress-indeterminate shadow-[0_0_12px_rgba(0,255,204,0.8)]" />
      </div>

      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-44 rounded-xl bg-slate-300/40 dark:bg-white/[0.05]" />
          <div className="h-4 w-64 rounded-lg bg-slate-300/30 dark:bg-white/[0.03]" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-slate-300/40 dark:bg-white/[0.05]" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="h-28 rounded-2xl bg-slate-300/30 dark:bg-white/[0.04] border border-slate-300/40 dark:border-white/[0.06]" />
        <div className="h-28 rounded-2xl bg-slate-300/30 dark:bg-white/[0.04] border border-slate-300/40 dark:border-white/[0.06]" />
        <div className="h-28 rounded-2xl bg-slate-300/30 dark:bg-white/[0.04] border border-slate-300/40 dark:border-white/[0.06]" />
      </div>

      {/* Content Skeleton */}
      <div className="h-72 rounded-2xl bg-slate-300/25 dark:bg-white/[0.03] border border-slate-300/40 dark:border-white/[0.06]" />
    </div>
  );
}
