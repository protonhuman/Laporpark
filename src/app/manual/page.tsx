"use client";

import { useState } from "react";
import Link from "next/link";
import LaporParkLogo from "@/components/lapor-park-logo";
import {
  ArrowLeft,
  BookOpen,
  Shield,
  Crown,
  Users,
  ClipboardCheck,
  Wrench,
  UserCog,
  LogIn,
  LayoutDashboard,
  FileText,
  FilePlus,
  Pencil,
  Trash2,
  CheckCircle,
  RotateCcw,
  Camera,
  Printer,
  KeyRound,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Building2,
  ArrowRight,
  HelpCircle,
  Info,
  Eye,
  Search,
  Filter,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Data / Constants
   ───────────────────────────────────────────── */

const ROLES = [
  {
    key: "superadmin",
    label: "Superadmin (Officer HO)",
    shortLabel: "Superadmin",
    levelBadge: "Tingkat 1 — Kantor Pusat",
    color: "rose",
    icon: Crown,
    gradient: "from-rose-500/20 to-rose-600/5",
    border: "border-rose-500/30",
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    description: "Kantor Pusat (Head Office) — Memegang kewenangan tertinggi atas sistem LaporPark, memonitor seluruh 14 bandara, mengelola master data, filter lintas bandara, dan kontrol sistem penuh.",
    scope: "Lintas 14 Bandara (kode: ALL)",
    emailFormat: "xxxx@laporpark.id",
    dashboard: true,
    createBA: true,
    editBA: true,
    deleteBA: true,
    checkBA: true,
    approveBA: true,
    reviseBA: true,
    finishBA: true,
    managePhotos: true,
    manageUsers: true,
    initialStatus: "Mengetahui",
  },
  {
    key: "supervisor",
    label: "Supervisor",
    shortLabel: "Supervisor",
    levelBadge: "Tingkat 2 — Pimpinan Cabang",
    color: "amber",
    icon: UserCog,
    gradient: "from-amber-500/20 to-amber-600/5",
    border: "border-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    description: "Kepala operasional cabang bandara — akses paling luas di tingkat cabang. Bertanggung jawab atas persetujuan akhir BA (status Diketahui & Selesai), pengembalian revisi, dan manajemen pengguna cabang.",
    scope: "Bandara Cabang Sendiri",
    emailFormat: "spv@laporpark.{kode}.id",
    dashboard: true,
    createBA: true,
    editBA: true,
    deleteBA: true,
    checkBA: false,
    approveBA: true,
    reviseBA: true,
    finishBA: true,
    managePhotos: true,
    manageUsers: true,
    initialStatus: "Diketahui",
  },
  {
    key: "carpark_manager",
    label: "Carpark Manager",
    shortLabel: "Carpark Manager",
    levelBadge: "Tingkat 3 — Manajerial Cabang",
    color: "sky",
    icon: ClipboardCheck,
    gradient: "from-sky-500/20 to-sky-600/5",
    border: "border-sky-500/30",
    text: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10",
    description: "Manajer operasional cabang — bertanggung jawab memeriksa dan memverifikasi setiap Berita Acara (status Diperiksa) sebelum disetujui Supervisor.",
    scope: "Bandara Cabang Sendiri",
    emailFormat: "cpm@laporpark.{kode}.id",
    dashboard: true,
    createBA: true,
    editBA: true,
    deleteBA: false,
    checkBA: true,
    approveBA: false,
    reviseBA: true,
    finishBA: false,
    managePhotos: true,
    manageUsers: false,
    initialStatus: "Diperiksa",
  },
  {
    key: "team_leader",
    label: "Team Leader",
    shortLabel: "Team Leader",
    levelBadge: "Tingkat 4 — Level Operasional Cabang (Setara)",
    color: "indigo",
    icon: Users,
    gradient: "from-indigo-500/20 to-indigo-600/5",
    border: "border-indigo-500/30",
    text: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
    description: "Pemimpin regu lapangan — berada di level operasional yang setara dengan Teknisi dan Admin Parkir. Bertugas membuat laporan Berita Acara insiden di lapangan.",
    scope: "Bandara Cabang Sendiri",
    emailFormat: "tl@laporpark.{kode}.id",
    dashboard: false,
    createBA: true,
    editBA: false,
    deleteBA: false,
    checkBA: false,
    approveBA: false,
    reviseBA: false,
    finishBA: false,
    managePhotos: "own",
    manageUsers: false,
    initialStatus: "Menunggu Review",
  },
  {
    key: "teknisi",
    label: "Teknisi",
    shortLabel: "Teknisi",
    levelBadge: "Tingkat 4 — Level Operasional Cabang (Setara)",
    color: "emerald",
    icon: Wrench,
    gradient: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    description: "Staf teknis lapangan — berada di level operasional yang setara dengan Team Leader dan Admin Parkir. Bertugas melaporkan insiden kerusakan teknis dan pemeliharaan alat.",
    scope: "Bandara Cabang Sendiri",
    emailFormat: "teknisi@laporpark.{kode}.id",
    dashboard: false,
    createBA: true,
    editBA: false,
    deleteBA: false,
    checkBA: false,
    approveBA: false,
    reviseBA: false,
    finishBA: false,
    managePhotos: "own",
    manageUsers: false,
    initialStatus: "Menunggu Review",
  },
  {
    key: "admin",
    label: "Admin Parkir (Cabang)",
    shortLabel: "Admin Parkir",
    levelBadge: "Tingkat 4 — Level Operasional Cabang (Setara)",
    color: "purple",
    icon: Shield,
    gradient: "from-purple-500/20 to-purple-600/5",
    border: "border-purple-500/30",
    text: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    description: "Staf administrasi cabang — berada di level operasional yang setara dengan Team Leader dan Teknisi. Bertugas menginput dan merekap Berita Acara di cabang serta mencetak arsip.",
    scope: "Bandara Cabang Sendiri",
    emailFormat: "admin@laporpark.{kode}.id",
    dashboard: false,
    createBA: true,
    editBA: false,
    deleteBA: false,
    checkBA: false,
    approveBA: false,
    reviseBA: false,
    finishBA: false,
    managePhotos: false,
    manageUsers: false,
    initialStatus: "Menunggu Review",
  },
] as const;

const BRANCH_ROLES = ROLES.filter((r) => r.key !== "superadmin");

const JENIS_INSIDEN = [
  { kode: "kerusakan", label: "Kerusakan", desc: "Kerusakan fasilitas/infrastruktur parkir" },
  { kode: "kerusakan_kendaraan", label: "Kerusakan Kendaraan", desc: "Kerusakan yang melibatkan kendaraan" },
  { kode: "komplain", label: "Komplain", desc: "Keluhan dari pengguna jasa parkir" },
  { kode: "kehilangan", label: "Kehilangan", desc: "Laporan kehilangan barang/kendaraan" },
  { kode: "gangguan_sistem", label: "Gangguan Sistem", desc: "Gangguan pada sistem IT/perangkat lunak" },
  { kode: "gangguan_perangkat", label: "Gangguan Perangkat", desc: "Gangguan pada perangkat keras" },
  { kode: "lainnya", label: "Lainnya", desc: "Insiden lain di luar kategori" },
];

const BANDARA_LIST = [
  { kode: "AMQ", nama: "Bandara Pattimura", lokasi: "Ambon" },
  { kode: "BDJ", nama: "Bandara Internasional Syamsudin Noor", lokasi: "Banjarmasin" },
  { kode: "BIK", nama: "Bandara Internasional Frans Kaisiepo", lokasi: "Biak" },
  { kode: "BPN", nama: "Bandara Internasional Sultan Aji Muhammad Sulaiman", lokasi: "Balikpapan" },
  { kode: "DJJ", nama: "Bandara Internasional Sentani", lokasi: "Jayapura" },
  { kode: "DPS", nama: "Bandara Internasional I Gusti Ngurah Rai", lokasi: "Denpasar" },
  { kode: "KOE", nama: "Bandara Internasional El Tari", lokasi: "Kupang" },
  { kode: "LOP", nama: "Bandara Internasional Zainuddin Abdul Madjid", lokasi: "Lombok" },
  { kode: "MDC", nama: "Bandara Internasional Sam Ratulangi", lokasi: "Manado" },
  { kode: "SOC", nama: "Bandara Internasional Adi Soemarmo", lokasi: "Solo" },
  { kode: "SRG", nama: "Bandara Internasional Jenderal Ahmad Yani", lokasi: "Semarang" },
  { kode: "SUB", nama: "Bandara Internasional Juanda", lokasi: "Surabaya" },
  { kode: "UPG", nama: "Bandara Internasional Sultan Hasanuddin", lokasi: "Makassar" },
  { kode: "YIA", nama: "Bandara Internasional Yogyakarta", lokasi: "Yogyakarta" },
];

const STATUS_LIST = [
  { key: "menunggu_review", label: "Menunggu Review", color: "bg-amber-500", desc: "BA baru, menunggu pemeriksaan Carpark Manager" },
  { key: "diperiksa", label: "Diperiksa", color: "bg-blue-500", desc: "CPM sudah memeriksa, menunggu persetujuan Supervisor" },
  { key: "revisi", label: "Revisi", color: "bg-orange-500", desc: "BA dikembalikan untuk diperbaiki oleh pembuat" },
  { key: "disetujui", label: "Diketahui", color: "bg-emerald-500", desc: "Supervisor sudah menyetujui BA" },
  { key: "selesai", label: "Selesai", color: "bg-teal-500", desc: "BA telah selesai dan ditutup" },
];

const FAQ_ITEMS = [
  {
    q: "Saya tidak bisa login, apa yang harus dilakukan?",
    a: "Pastikan format email sesuai: Untuk akun staf cabang gunakan format xxxx@laporpark.{kode_bandara}.id (contoh: admin@laporpark.sub.id, supervisor@laporpark.dps.id, cpm@laporpark.upg.id). Pastikan password sudah benar (default akun baru: 123123). Jika masih gagal, hubungi Supervisor bandara Anda.",
  },
  {
    q: "Apa perbedaan Superadmin (Officer HO) dengan Admin Parkir Cabang?",
    a: "Superadmin (Officer HO) berada di Kantor Pusat dan memonitor seluruh 14 bandara (kode: ALL) dengan email @laporpark.ho.id. Sedangkan Admin Parkir Cabang adalah staf administrasi di cabang bandara tertentu dengan level setara Team Leader dan Teknisi, hanya mengelola data di bandara cabangnya sendiri dengan domain email @laporpark.{kode_bandara}.id.",
  },
  {
    q: "Saya tidak bisa melihat Dashboard, kenapa?",
    a: "Dashboard statistik hanya tersedia untuk Superadmin, Supervisor, dan Carpark Manager. Jika Anda adalah Team Leader, Teknisi, atau Admin Parkir Cabang — Anda langsung diarahkan ke menu Daftar Berita Acara.",
  },
  {
    q: "Kenapa saya tidak bisa mengedit Berita Acara?",
    a: "Hanya Carpark Manager dan Supervisor yang dapat mengedit BA. Selain itu, BA yang sudah berstatus \"Diketahui\" atau \"Selesai\" tidak dapat diedit lagi (kecuali foto lampiran).",
  },
  {
    q: "Saya tidak bisa melihat BA dari bandara lain?",
    a: "Ini adalah fitur Isolasi Multi-Cabang. Setiap pengguna hanya dapat melihat BA dari bandara tempat mereka ditugaskan, sesuai kode bandara di email masing-masing.",
  },
  {
    q: "Tombol persetujuan tidak muncul di halaman detail BA?",
    a: "Tombol approval hanya tampil sesuai role Anda dan status BA saat ini. Misalnya tombol \"Setujui\" hanya tampil untuk Supervisor saat BA berstatus \"Menunggu Review\" atau \"Diperiksa\".",
  },
  {
    q: "Bagaimana cara menambah foto setelah BA dibuat?",
    a: "Buka halaman detail BA → klik tombol \"Kelola Foto\" di bagian Lampiran Foto. Anda dapat menambah atau menghapus foto. Fitur ini tetap tersedia meskipun BA sudah berstatus Selesai (untuk pembuat BA, CM, atau Supervisor).",
  },
  {
    q: "Nomor BA tidak berurut, apakah normal?",
    a: "Ya. Nomor BA digenerate otomatis berdasarkan bulan dan tahun saat BA dibuat. Jika ada BA yang dihapus, nomor tersebut tidak akan dipakai ulang.",
  },
  {
    q: "Bagaimana cara mencetak BA ke PDF?",
    a: "Buka halaman detail BA → klik tombol \"Print/PDF\" → pada dialog cetak browser, pilih \"Save as PDF\" sebagai tujuan printer → klik Simpan.",
  },
];

const FORM_FIELDS = [
  { label: "Tanggal Kejadian", desc: "Tanggal insiden terjadi", required: true },
  { label: "Waktu Kejadian", desc: "Jam insiden terjadi", required: true },
  { label: "Lokasi / Zona", desc: "Area spesifik di parkir bandara", required: true },
  { label: "Jenis Insiden", desc: "Pilih dari dropdown kategori", required: true },
  { label: "Pihak Terlibat", desc: "Nama/pihak yang terlibat (jika ada)", required: false },
  { label: "Judul Masalah", desc: "Ringkasan singkat insiden", required: true },
  { label: "Kronologi", desc: "Uraian lengkap kejadian", required: true },
  { label: "Tindakan yang Dilakukan", desc: "Langkah yang sudah diambil", required: true },
  { label: "Penyelesaian", desc: "Hasil penyelesaian insiden", required: true },
  { label: "Mitigasi", desc: "Langkah pencegahan ke depan", required: true },
  { label: "Lampiran Foto", desc: "Upload foto bukti/dokumentasi", required: false },
];

/* ─────────────────────────────────────────────
   Helper Components
   ───────────────────────────────────────────── */

function PermIcon({ val }: { val: boolean | string }) {
  if (val === true) return <CheckCircle className="w-4 h-4 text-emerald-500" />;
  if (val === "own") return <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">BA sendiri</span>;
  return <span className="w-4 h-4 rounded-full bg-slate-300/60 dark:bg-white/10 block" />;
}

function SectionTitle({ id, icon: Icon, title, subtitle }: { id: string; icon: typeof BookOpen; title: string; subtitle: string }) {
  return (
    <div id={id} className="pt-8 mb-6 scroll-mt-24 print:pt-2 print:mb-3 text-center">
      <div className="flex flex-col items-center justify-center gap-2 mb-1">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] print:shadow-none print:border print:border-slate-300">
          <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 print:text-emerald-700" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white print:text-black tracking-tight">{title}</h2>
          <p className="text-xs text-slate-500 print:text-slate-600 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent mt-3 print:bg-slate-300" />
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="neo-card overflow-hidden print:shadow-none print:border print:border-slate-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer hover:bg-white/30 dark:hover:bg-white/[0.02] transition-colors"
      >
        <HelpCircle className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100 print:text-black">{q}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 pt-0 pl-12">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed print:text-slate-700">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TOC Navigation Items
   ───────────────────────────────────────────── */

const TOC = [
  { id: "pengenalan", label: "Pengenalan Sistem" },
  { id: "hierarki", label: "Hierarki Peran" },
  { id: "login", label: "Login & Autentikasi" },
  { id: "navigasi", label: "Navigasi & Sidebar" },
  { id: "panduan-role", label: "Panduan per Role" },
  { id: "berita-acara", label: "Fitur Berita Acara" },
  { id: "alur", label: "Alur Persetujuan" },
  { id: "cetak", label: "Cetak & PDF" },
  { id: "password", label: "Ganti Password" },
  { id: "faq", label: "FAQ" },
];

/* ─────────────────────────────────────────────
   Main Page Component
   ───────────────────────────────────────────── */

export default function ManualBookPage() {
  const [activeRole, setActiveRole] = useState<string>("supervisor");
  const selectedRole = BRANCH_ROLES.find((r) => r.key === activeRole) || BRANCH_ROLES[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══ Top Header Bar ═══ */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-slate-300/40 dark:border-white/[0.06] shadow-[0_4px_12px_var(--shadow-dark)] print:static print:shadow-none print:border-b print:border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/[0.04] text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all print:hidden"
              title="Kembali ke Halaman Login"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="print:hidden">
                <LaporParkLogo size="sm" interactive={false} />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-white tracking-tight print:text-black">
                  Manual Book <span className="text-emerald-500">LaporPark</span>
                </h1>
                <p className="text-[10px] text-slate-500 hidden sm:block print:block print:text-slate-600">Sistem Manajemen Berita Acara Parkir — Angkasa Pura Supports</p>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* TOC Scrollable Bar — Desktop & Mobile */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 print:hidden">
          <nav className="flex items-center sm:justify-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1">
            {TOC.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-all whitespace-nowrap shrink-0"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ═══ Main Content ═══ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:py-0 print:max-w-none">

        {/* ─── Corporate Header (Print Only) ─── */}
        <div className="hidden print:flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-400">
          <div className="flex items-center gap-4">
            <img src="/logo-aps.png" alt="APS" className="h-10" />
            <img src="/logo-cp.png" alt="Centre Park" className="h-8" />
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold text-black">Manual Book LaporPark</h1>
            <p className="text-xs text-slate-600">Sistem Manajemen Berita Acara Parkir</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Angkasa Pura Supports — Unit Parkir</p>
          </div>
        </div>

        {/* ═══ 1. PENGENALAN SISTEM ═══ */}
        <SectionTitle id="pengenalan" icon={BookOpen} title="Pengenalan Sistem" subtitle="Apa itu LaporPark dan untuk apa digunakan" />

        <div className="neo-card p-5 sm:p-6 mb-6 w-full print:shadow-none print:border print:border-slate-200">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="flex items-center justify-center shrink-0">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] print:shadow-none print:border print:border-emerald-200">
                <BookOpen className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed print:text-slate-800">
                <strong className="text-slate-800 dark:text-white print:text-black">LaporPark</strong> adalah aplikasi web berbasis <em>Berita Acara</em> yang digunakan untuk mencatat, melacak, dan menyelesaikan insiden yang terjadi di area parkir bandara di bawah naungan <strong>Angkasa Pura Supports</strong> bekerja sama dengan <strong>Centre Park</strong>.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2 print:text-slate-800">
                Setiap insiden dicatat dalam Berita Acara (BA) yang melewati proses verifikasi berjenjang — dari pembuat, pemeriksa, hingga persetujuan — memastikan akuntabilitas dan dokumentasi yang lengkap.
              </p>
            </div>
          </div>
        </div>

        {/* Jenis Insiden */}
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 text-center print:text-black">Jenis Insiden yang Dicatat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 w-full print:grid-cols-3">
          {JENIS_INSIDEN.map((j) => (
            <div key={j.kode} className="neo-card p-4 flex items-start gap-3 print:shadow-none print:border print:border-slate-200 print:p-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white print:text-black">{j.label}</p>
                <p className="text-xs text-slate-500 mt-0.5 print:text-slate-600">{j.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bandara */}
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 text-center print:text-black">14 Bandara yang Didukung</h3>
        <div className="neo-card overflow-hidden mb-8 w-full print:shadow-none print:border print:border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-300/50 dark:border-white/[0.08] print:border-slate-300">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center print:text-slate-700 w-1/4">Kode</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center print:text-slate-700 w-1/2">Nama Bandara</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center print:text-slate-700 w-1/4">Lokasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/40 dark:divide-white/[0.04] print:divide-slate-200">
                {BANDARA_LIST.map((b) => (
                  <tr key={b.kode} className="hover:bg-white/30 dark:hover:bg-white/[0.02] print:hover:bg-transparent">
                    <td className="px-4 py-2.5 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 text-center print:text-emerald-700">{b.kode}</td>
                    <td className="px-4 py-2.5 text-slate-800 dark:text-white font-medium text-center print:text-black">{b.nama}</td>
                    <td className="px-4 py-2.5 text-slate-500 text-center print:text-slate-600">{b.lokasi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ 2. HIERARKI PERAN ═══ */}
        <SectionTitle id="hierarki" icon={Shield} title="Hierarki Peran Pengguna" subtitle="Struktur peran dari Kantor Pusat (Officer HO) hingga Level Operasional Cabang" />

        {/* Role Hierarchy Visual Architecture */}
        <div className="neo-card p-5 sm:p-6 mb-6 w-full print:shadow-none print:border print:border-slate-200">
          <div className="flex flex-col items-center gap-3 py-2">
            {/* Level 1: Superadmin */}
            <div className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-rose-600/5 border border-rose-500/30 shadow-[3px_3px_8px_var(--shadow-dark),-3px_-3px_8px_var(--shadow-light)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold shrink-0 shadow-sm">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400">Superadmin (Officer HO)</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-500/20">Tingkat 1 (HO)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Kantor Pusat — Akses Seluruh 14 Bandara (<code>xxxx@laporpark.ho.id</code>)</p>
                </div>
              </div>
              <div className="shrink-0">
                <span className="text-[11px] uppercase font-bold tracking-wider text-rose-500/90 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">Head Office</span>
              </div>
            </div>

            {/* Down Connector */}
            <div className="flex items-center justify-center text-slate-400 dark:text-slate-500 my-0.5">
              <ChevronDown className="w-5 h-5" />
            </div>

            {/* Level 2: Supervisor */}
            <div className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-600/5 border border-amber-500/30 shadow-[3px_3px_8px_var(--shadow-dark),-3px_-3px_8px_var(--shadow-light)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold shrink-0 shadow-sm">
                  <UserCog className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400">Supervisor</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20">Tingkat 2</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Pimpinan Operasional Cabang — Persetujuan Akhir BA & Pengguna Cabang</p>
                </div>
              </div>
              <div className="shrink-0">
                <span className="text-[11px] uppercase font-bold tracking-wider text-amber-500/90 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">Cabang</span>
              </div>
            </div>

            {/* Down Connector */}
            <div className="flex items-center justify-center text-slate-400 dark:text-slate-500 my-0.5">
              <ChevronDown className="w-5 h-5" />
            </div>

            {/* Level 3: Carpark Manager */}
            <div className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-sky-500/20 via-sky-500/10 to-sky-600/5 border border-sky-500/30 shadow-[3px_3px_8px_var(--shadow-dark),-3px_-3px_8px_var(--shadow-light)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold shrink-0 shadow-sm">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-sm sm:text-base font-bold text-sky-600 dark:text-sky-400">Carpark Manager</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-bold border border-sky-500/20">Tingkat 3</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Manajer Operasional Cabang — Pemeriksaan & Validasi (Status Diperiksa)</p>
                </div>
              </div>
              <div className="shrink-0">
                <span className="text-[11px] uppercase font-bold tracking-wider text-sky-500/90 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20">Cabang</span>
              </div>
            </div>

            {/* Down Connector */}
            <div className="flex items-center justify-center text-slate-400 dark:text-slate-500 my-0.5">
              <ChevronDown className="w-5 h-5" />
            </div>

            {/* Level 4: Equal Operational Level (Team Leader, Teknisi, Admin) */}
            <div className="w-full p-4 sm:p-6 rounded-2xl bg-slate-500/5 dark:bg-white/[0.02] border border-slate-300/60 dark:border-white/[0.08] shadow-[inset_2px_2px_5px_var(--shadow-dark),inset_-2px_-2px_5px_var(--shadow-light)]">
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Tingkat 4 — Level Operasional Cabang (Tingkatan Setara / Sama)
                </span>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl mx-auto">
                  Team Leader, Teknisi, dan Admin Parkir memiliki level operasional yang setara: membuat BA baru, memantau daftar BA cabang, dan mencetak dokumen.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Team Leader */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/15 to-indigo-600/5 border border-indigo-500/25 flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Team Leader</span>
                  <p className="text-xs text-slate-500 mt-0.5">Pemimpin Regu Lapangan</p>
                  <code className="text-[10px] text-indigo-500 mt-1.5 font-mono">teamleader@laporpark.xxx.id</code>
                </div>

                {/* Teknisi */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 border border-emerald-500/25 flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Teknisi</span>
                  <p className="text-xs text-slate-500 mt-0.5">Pemeliharaan & Alat</p>
                  <code className="text-[10px] text-emerald-500 mt-1.5 font-mono">teknisi@laporpark.xxx.id</code>
                </div>

                {/* Admin Parkir */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/15 to-purple-600/5 border border-purple-500/25 flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">Admin Parkir (Cabang)</span>
                  <p className="text-xs text-slate-500 mt-0.5">Administrasi & Pencatatan</p>
                  <code className="text-[10px] text-purple-500 mt-1.5 font-mono">admin@laporpark.xxx.id</code>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Permission Matrix Table */}
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 text-center print:text-black">Tabel Perbandingan Hak Akses per Role</h3>
        <div className="neo-card overflow-hidden mb-8 w-full print:shadow-none print:border print:border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[750px]">
              <thead>
                <tr className="border-b border-slate-300/50 dark:border-white/[0.08] print:border-slate-300">
                  <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left print:text-slate-700">Fitur</th>
                  {BRANCH_ROLES.map((r) => (
                    <th key={r.key} className={`px-2.5 py-3 text-[11px] font-bold uppercase tracking-wider text-center ${r.text}`}>
                      <div className="flex flex-col items-center gap-0.5">
                        <r.icon className="w-3.5 h-3.5 mb-0.5" />
                        <span>{r.shortLabel}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/40 dark:divide-white/[0.04] print:divide-slate-200">
                {[
                  { label: "Dashboard Statistik", field: "dashboard" },
                  { label: "Daftar BA", field: "createBA" },
                  { label: "Buat BA Baru", field: "createBA" },
                  { label: "Edit BA", field: "editBA" },
                  { label: "Hapus BA", field: "deleteBA" },
                  { label: "Tandai Diperiksa", field: "checkBA" },
                  { label: "Setujui BA", field: "approveBA" },
                  { label: "Minta Revisi", field: "reviseBA" },
                  { label: "Tandai Selesai", field: "finishBA" },
                  { label: "Kelola Foto", field: "managePhotos" },
                  { label: "Kelola Pengguna", field: "manageUsers" },
                ].map((row) => (
                  <tr key={row.label} className="hover:bg-white/30 dark:hover:bg-white/[0.02]">
                    <td className="px-3 py-2.5 font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap print:text-black">{row.label}</td>
                    {BRANCH_ROLES.map((r) => (
                      <td key={r.key} className="px-2.5 py-2.5 text-center">
                        <div className="flex justify-center">
                          <PermIcon val={row.field === "dashboard" ? r.dashboard : (r as Record<string, unknown>)[row.field] as boolean | string} />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ 3. LOGIN ═══ */}
        <SectionTitle id="login" icon={LogIn} title="Login & Autentikasi" subtitle="Cara masuk ke sistem LaporPark" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 w-full">
          <div className="neo-card p-5 print:shadow-none print:border print:border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2.5 print:text-black">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 grid place-items-center text-emerald-600 dark:text-emerald-400 shrink-0 leading-none">
                <LogIn className="w-3.5 h-3.5 block" />
              </div>
              Langkah Login
            </h3>
            <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">
              <li className="flex gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 grid place-items-center text-xs font-bold shrink-0 mt-0.5 leading-none">1</span>
                <div>
                  <p>Masukkan <strong>Email</strong> resmi Anda:</p>
                  <p className="text-xs text-slate-500 mt-1">
                    • <strong>Pengguna Cabang:</strong> format <code>xxxx@laporpark.xxx.id</code> (contoh: <code>admin@laporpark.sub.id</code>, <code>supervisor@laporpark.dps.id</code>, <code>teamleader@laporpark.bpn.id</code>, <code>teknisi@laporpark.yia.id</code>)
                  </p>
                </div>
              </li>
              <li className="flex gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 grid place-items-center text-xs font-bold shrink-0 mt-0.5 leading-none">2</span>
                <span>Masukkan <strong>Password</strong> — default akun baru: <code className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-white/[0.06] text-xs font-mono print:bg-slate-100">123123</code></span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 grid place-items-center text-xs font-bold shrink-0 mt-0.5 leading-none">3</span>
                <span>Centang <strong>&ldquo;Ingat Saya&rdquo;</strong> agar tersimpan (opsional)</span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 grid place-items-center text-xs font-bold shrink-0 mt-0.5 leading-none">4</span>
                <span>Klik tombol <strong>&ldquo;Masuk&rdquo;</strong></span>
              </li>
            </ol>
          </div>
          <div className="neo-card p-5 print:shadow-none print:border print:border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2.5 print:text-black">
              <div className="w-6 h-6 rounded-lg bg-amber-500/15 grid place-items-center text-amber-600 dark:text-amber-400 shrink-0 leading-none">
                <AlertCircle className="w-3.5 h-3.5 block" />
              </div>
              Hal Penting
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">
              <li className="flex gap-2.5 items-start">
                <div className="w-6 h-6 rounded-lg bg-amber-500/15 grid place-items-center text-amber-600 dark:text-amber-400 shrink-0 leading-none mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 block" />
                </div>
                <span>Segera ubah password default setelah login pertama kali via menu Ganti Password.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <div className="w-6 h-6 rounded-lg bg-sky-500/15 grid place-items-center text-sky-600 dark:text-sky-400 shrink-0 leading-none mt-0.5">
                  <Info className="w-3.5 h-3.5 block" />
                </div>
                <span>Kode bandara otomatis dikenali dari domain email Anda (misal: <code>sub</code> untuk Surabaya Juanda, <code>dps</code> untuk Denpasar Bali).</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/15 grid place-items-center text-emerald-600 dark:text-emerald-400 shrink-0 leading-none mt-0.5">
                  <ArrowRight className="w-3.5 h-3.5 block" />
                </div>
                <span><strong>Superadmin, Supervisor & CPM</strong> diarahkan ke Dashboard statistik. <strong>Team Leader, Teknisi & Admin Parkir</strong> diarahkan ke Daftar Berita Acara.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ═══ 4. NAVIGASI ═══ */}
        <SectionTitle id="navigasi" icon={LayoutDashboard} title="Navigasi & Sidebar" subtitle="Menu yang tersedia berdasarkan role" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8 w-full">
          {[
            { icon: LayoutDashboard, label: "Dashboard", desc: "Statistik & ringkasan", roles: "Supervisor, CM" },
            { icon: FileText, label: "Daftar BA", desc: "Semua Berita Acara", roles: "Semua Role" },
            { icon: FilePlus, label: "Buat BA Baru", desc: "Lapor insiden baru", roles: "Semua Role" },
            { icon: Users, label: "Manajemen Pengguna", desc: "CRUD akun tim", roles: "Supervisor" },
          ].map((m) => (
            <div key={m.label} className="neo-card p-4 flex flex-col items-center text-center gap-2 print:shadow-none print:border print:border-slate-200 print:p-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500/15 to-indigo-500/15 flex items-center justify-center shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] print:shadow-none print:border print:border-sky-200">
                <m.icon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-white print:text-black">{m.label}</h4>
              <p className="text-[11px] text-slate-500 print:text-slate-600">{m.desc}</p>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20 print:text-emerald-700">{m.roles}</span>
            </div>
          ))}
        </div>

        {/* ═══ 5. PANDUAN PER ROLE ═══ */}
        <SectionTitle id="panduan-role" icon={Users} title="Panduan per Tingkatan" subtitle="Klik role untuk melihat panduan detail" />

        {/* Role Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 print:hidden">
          {BRANCH_ROLES.map((r) => (
            <button
              key={r.key}
              onClick={() => setActiveRole(r.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer select-none ${
                activeRole === r.key
                  ? `bg-gradient-to-r ${r.gradient} ${r.text} border ${r.border} shadow-[4px_4px_10px_var(--shadow-dark),-4px_-4px_10px_var(--shadow-light)]`
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-white shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] hover:shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] border border-transparent"
              }`}
            >
              <r.icon className="w-4 h-4" />
              {r.label}
            </button>
          ))}
        </div>

        {/* Active Role Detail Card */}
        <div className={`neo-card p-5 sm:p-6 border ${selectedRole.border} bg-gradient-to-br ${selectedRole.gradient} mb-8 w-full print:shadow-none print:border print:border-slate-200 print:bg-white`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 mb-5">
            <div className={`w-12 h-12 rounded-2xl ${selectedRole.bg} flex items-center justify-center shadow-[4px_4px_8px_var(--shadow-dark),-4px_-4px_8px_var(--shadow-light)] print:shadow-none print:border print:border-slate-200 shrink-0`}>
              <selectedRole.icon className={`w-6 h-6 ${selectedRole.text}`} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className={`text-lg font-bold ${selectedRole.text}`}>{selectedRole.label}</h3>
                <span className={`px-2 py-0.5 rounded-full ${selectedRole.bg} ${selectedRole.text} text-[10px] font-bold border ${selectedRole.border}`}>
                  {selectedRole.levelBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500 print:text-slate-600 mt-0.5">{selectedRole.description}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 text-[11px] text-slate-500">
                <span>📍 Cakupan: <strong className="text-slate-700 dark:text-slate-300">{selectedRole.scope}</strong></span>
                <span>✉️ Email: <code className="px-1.5 py-0.5 rounded bg-white/60 dark:bg-white/[0.06] font-mono text-[10px] text-emerald-600 dark:text-emerald-400 border border-white/60 dark:border-white/[0.08]">{selectedRole.emailFormat}</code></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
            {[
              { icon: LayoutDashboard, label: "Dashboard", val: selectedRole.dashboard },
              { icon: FilePlus, label: "Buat BA", val: selectedRole.createBA },
              { icon: Pencil, label: "Edit BA", val: selectedRole.editBA },
              { icon: Trash2, label: "Hapus BA", val: selectedRole.deleteBA },
              { icon: CheckCircle, label: "Periksa", val: selectedRole.checkBA },
              { icon: CheckCircle, label: "Setujui", val: selectedRole.approveBA },
              { icon: RotateCcw, label: "Revisi", val: selectedRole.reviseBA },
              { icon: Camera, label: "Kelola Foto", val: selectedRole.managePhotos },
              { icon: Users, label: "Kelola User", val: selectedRole.manageUsers },
              { icon: CheckCircle, label: "Tandai Selesai", val: selectedRole.finishBA },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/40 dark:bg-white/[0.03] border border-white/60 dark:border-white/[0.06] print:bg-white print:border-slate-200">
                <item.icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-700 dark:text-slate-300 flex-1 print:text-slate-800">{item.label}</span>
                <PermIcon val={item.val} />
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-white/60 dark:border-white/[0.06] text-center print:bg-slate-50 print:border-slate-200">
            <p className="text-xs text-slate-600 dark:text-slate-300 print:text-slate-700">
              <strong className="text-slate-800 dark:text-white print:text-black">Status awal BA saat dibuat:</strong>{" "}
              <span className={`px-2 py-0.5 rounded-md ${selectedRole.bg} ${selectedRole.text} text-[11px] font-bold border ${selectedRole.border}`}>
                {selectedRole.initialStatus}
              </span>
            </p>
          </div>
        </div>

        {/* Print-only: show all roles */}
        <div className="hidden print:block space-y-4 mb-8 w-full">
          {BRANCH_ROLES.map((r) => (
            <div key={r.key} className="border border-slate-200 rounded-lg p-4 break-inside-avoid">
              <h4 className="font-bold text-black mb-1">{r.label}</h4>
              <p className="text-xs text-slate-600 mb-2">{r.description}</p>
              <p className="text-xs text-slate-700"><strong>Status awal BA:</strong> {r.initialStatus}</p>
              <p className="text-xs text-slate-700 mt-1">
                <strong>Hak akses:</strong>{" "}
                {r.dashboard && "Dashboard, "}
                Buat BA,
                {r.editBA ? " Edit BA," : ""}
                {r.deleteBA ? " Hapus BA," : ""}
                {r.checkBA ? " Periksa BA," : ""}
                {r.approveBA ? " Setujui BA," : ""}
                {r.reviseBA ? " Minta Revisi," : ""}
                {r.finishBA ? " Tandai Selesai," : ""}
                {r.managePhotos ? (r.managePhotos === "own" ? " Foto (BA sendiri)," : " Kelola Foto,") : ""}
                {r.manageUsers ? " Kelola Pengguna" : ""}
              </p>
            </div>
          ))}
        </div>

        {/* ═══ 6. FITUR BERITA ACARA ═══ */}
        <SectionTitle id="berita-acara" icon={FileText} title="Fitur Berita Acara" subtitle="Melihat, membuat, dan mengelola laporan insiden" />

        {/* Daftar BA features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 w-full">
          {[
            { icon: Search, label: "Pencarian", desc: "Cari berdasarkan judul masalah atau nomor BA" },
            { icon: Filter, label: "Filter Status", desc: "Filter: Menunggu Review, Diperiksa, Revisi, Diketahui, Selesai" },
            { icon: Eye, label: "Detail Lengkap", desc: "Kronologi, tindakan, penyelesaian, mitigasi, foto lampiran" },
            { icon: Printer, label: "Cetak / PDF", desc: "Cetak dokumen resmi lengkap dengan tanda tangan digital" },
          ].map((f) => (
            <div key={f.label} className="neo-card p-4 flex items-start gap-3 print:shadow-none print:border print:border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0 shadow-[2px_2px_4px_var(--shadow-dark),-2px_-2px_4px_var(--shadow-light)] print:shadow-none print:border print:border-sky-200">
                <f.icon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white print:text-black">{f.label}</p>
                <p className="text-xs text-slate-500 mt-0.5 print:text-slate-600">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form Fields for Creating BA */}
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 text-center print:text-black">Kolom Formulir Pembuatan BA</h3>
        <div className="neo-card overflow-hidden mb-6 w-full print:shadow-none print:border print:border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-300/50 dark:border-white/[0.08] print:border-slate-300">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center print:text-slate-700 w-1/4">Kolom</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center print:text-slate-700 w-1/2">Deskripsi</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center print:text-slate-700 w-1/4">Wajib</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/40 dark:divide-white/[0.04] print:divide-slate-200">
                {FORM_FIELDS.map((f) => (
                  <tr key={f.label}>
                    <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-white whitespace-nowrap text-center print:text-black">{f.label}</td>
                    <td className="px-4 py-2.5 text-slate-500 text-center print:text-slate-600">{f.desc}</td>
                    <td className="px-4 py-2.5 text-center">
                      {f.required ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-[10px] text-slate-400">Opsional</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Badge Legend */}
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 text-center print:text-black">Status Berita Acara</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8 w-full print:grid-cols-3">
          {STATUS_LIST.map((s) => (
            <div key={s.key} className="neo-card p-4 flex items-start gap-3 print:shadow-none print:border print:border-slate-200 print:p-2">
              <div className={`w-3 h-3 rounded-full ${s.color} mt-1 shrink-0`} />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white print:text-black">{s.label}</p>
                <p className="text-xs text-slate-500 mt-0.5 print:text-slate-600">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ═══ 7. ALUR PERSETUJUAN ═══ */}
        <SectionTitle id="alur" icon={CheckCircle} title="Alur Persetujuan" subtitle="Workflow dari pembuatan hingga penyelesaian BA" />

        {/* Workflow Visual */}
        <div className="neo-card p-5 sm:p-6 mb-8 w-full print:shadow-none print:border print:border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 text-center print:text-black">Alur Standar</h3>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 justify-center flex-wrap">
            {[
              { label: "Dibuat TL/Teknisi/Admin", color: "bg-indigo-500", textColor: "text-white" },
              { label: "Menunggu Review", color: "bg-amber-500", textColor: "text-white" },
              { label: "Diperiksa (CPM)", color: "bg-blue-500", textColor: "text-white" },
              { label: "Diketahui (SPV)", color: "bg-emerald-500", textColor: "text-white" },
              { label: "Selesai", color: "bg-teal-500", textColor: "text-white" },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-0">
                <div className={`${step.color} ${step.textColor} px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shadow-md`}>
                  {step.label}
                </div>
                {i < 4 && <ChevronRight className="w-4 h-4 text-slate-400 mx-1 hidden sm:block shrink-0" />}
                {i < 4 && <ChevronDown className="w-4 h-4 text-slate-400 sm:hidden shrink-0" />}
              </div>
            ))}
          </div>

          {/* Revision branch */}
          <div className="flex items-center justify-center mt-4 gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-semibold">
              ↩️ Revisi — dikembalikan oleh CM atau SPV untuk diperbaiki
            </div>
          </div>
        </div>

        {/* ═══ 8. CETAK & PDF ═══ */}
        <SectionTitle id="cetak" icon={Printer} title="Cetak & Download PDF" subtitle="Cara mencetak Berita Acara sebagai dokumen resmi" />

        <div className="neo-card p-5 sm:p-6 mb-8 w-full print:shadow-none print:border print:border-slate-200">
          <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-600 flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <span>Buka halaman <strong>Detail Berita Acara</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-600 flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <span>Klik tombol <strong>&ldquo;Print / PDF&rdquo;</strong> di bagian kanan atas</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-600 flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <span>Pada dialog cetak browser, pilih <strong>&ldquo;Save as PDF&rdquo;</strong> sebagai tujuan printer</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-600 flex items-center justify-center text-xs font-bold shrink-0">4</span>
              <span>Klik <strong>&ldquo;Simpan&rdquo;</strong> — file PDF akan terunduh</span>
            </li>
          </ol>
          <div className="mt-4 p-3 rounded-xl bg-sky-500/5 border border-sky-500/20">
            <p className="text-xs text-slate-600 dark:text-slate-300 print:text-slate-700">
              📄 Layout cetak berisi format dokumen resmi dengan kop surat, nomor BA, seluruh detail insiden, dan tanda tangan digital (jika tersedia) dari Pembuat, Pemeriksa (CPM), dan Mengetahui (Supervisor).
            </p>
          </div>
        </div>

        {/* ═══ 9. GANTI PASSWORD ═══ */}
        <SectionTitle id="password" icon={KeyRound} title="Ganti Password" subtitle="Ubah password akun Anda" />

        <div className="neo-card p-5 sm:p-6 mb-8 w-full print:shadow-none print:border print:border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2 print:text-black">Cara Ganti Password</h4>
              <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">
                <li className="flex gap-2"><span className="font-bold text-emerald-600">1.</span> Klik tombol <strong>&ldquo;Ganti Password&rdquo;</strong> (🔑) di sidebar</li>
                <li className="flex gap-2"><span className="font-bold text-emerald-600">2.</span> Masukkan <strong>Password Baru</strong> (minimal 6 karakter)</li>
                <li className="flex gap-2"><span className="font-bold text-emerald-600">3.</span> Masukkan <strong>Konfirmasi Password</strong></li>
                <li className="flex gap-2"><span className="font-bold text-emerald-600">4.</span> Klik <strong>&ldquo;Simpan&rdquo;</strong></li>
              </ol>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2 print:text-black">
                <Moon className="w-4 h-4" /> <Sun className="w-4 h-4" /> Dark / Light Mode
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 print:text-slate-800">
                Klik ikon 🌙/☀️ di sidebar (desktop) atau di header bar (mobile) untuk beralih antara tema gelap dan terang. Perubahan langsung diterapkan tanpa refresh.
              </p>
            </div>
          </div>
        </div>

        {/* ═══ 10. FAQ ═══ */}
        <SectionTitle id="faq" icon={HelpCircle} title="FAQ & Troubleshooting" subtitle="Pertanyaan yang sering ditanyakan" />

        <div className="space-y-2 mb-8 w-full">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>

        {/* ═══ Footer ═══ */}
        <div className="text-center py-8 border-t border-slate-300/40 dark:border-white/[0.06] print:border-slate-300">
          <p className="text-xs text-slate-500 print:text-slate-600">
            Manual Book v1.0 — September 2026
          </p>
          <p className="text-xs text-slate-400 mt-1 print:text-slate-500">
            <strong>LaporPark</strong> — Sistem Manajemen Berita Acara Parkir
          </p>
          <p className="text-xs text-slate-400 print:text-slate-500">
            Angkasa Pura Supports × Centre Park
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 print:hidden">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
