"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";
import type { User } from "@/lib/types";
import { ROLE_LABELS } from "@/lib/types";
import { getBandaraByKode } from "@/lib/constants";
import ChangePasswordModal from "@/components/change-password-modal";
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Users,
} from "lucide-react";
import BrandLockup from "@/components/brand-lockup";
import LaporParkLogo from "@/components/lapor-park-logo";
import ThemeToggle from "@/components/theme-toggle";
import { useState } from "react";

interface SidebarProps {
  user: User;
}

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/berita-acara",
    label: "Daftar Berita Acara",
    icon: FileText,
  },
  {
    href: "/berita-acara/baru",
    label: "Buat BA Baru",
    icon: FilePlus,
  },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dynamic nav items based on role
  const navItems = NAV_ITEMS.filter((item) => {
    if (item.href === "/dashboard") {
      return user.role === "carpark_manager" || user.role === "supervisor" || user.role === "superadmin";
    }
    if (item.href === "/berita-acara/baru") {
      return user.role !== "superadmin";
    }
    return true;
  });
  if (user.role === "supervisor" || user.role === "superadmin") {
    navItems.push({
      href: "/pengguna",
      label: "Manajemen Pengguna",
      icon: Users,
    });
  }

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/berita-acara") return pathname === "/berita-acara";
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand & Corporate Lockup */}
      <div className="relative px-3 py-4 border-b border-slate-300/40 shadow-[0_4px_12px_rgba(163,177,198,0.25)] bg-gradient-to-b from-white/30 to-transparent">
        {/* Close Button for Mobile inside Sidebar */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-3.5 right-3 p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/50 transition-colors z-10 cursor-pointer"
          aria-label="Tutup Menu"
        >
          <X className="w-5 h-5" />
        </button>

        <Link
          href={user.role === "carpark_manager" || user.role === "supervisor" ? "/dashboard" : "/berita-acara"}
          className="block w-full group"
        >
          <BrandLockup variant="sidebar" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out active:scale-[0.98] ${
                active
                  ? "bg-teal-600/10 dark:bg-[#00ffcc]/15 text-teal-700 dark:text-[#00ffcc] shadow-[0_2px_10px_rgba(13,148,136,0.12)] dark:shadow-[0_2px_14px_rgba(0,255,204,0.18)] font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05] hover:translate-x-1"
              }`}
            >
              {/* Active Indicator Bar */}
              {active && (
                <span
                  className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-teal-600 dark:bg-[#00ffcc] shadow-[0_0_8px_rgba(13,148,136,0.5)] dark:shadow-[0_0_10px_rgba(0,255,204,0.8)]"
                  aria-hidden="true"
                />
              )}
              <item.icon
                className={`w-[18px] h-[18px] transition-transform duration-200 ${
                  active
                    ? "text-teal-600 dark:text-[#00ffcc] scale-105 drop-shadow-[0_0_6px_rgba(0,255,204,0.4)]"
                    : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:scale-110"
                }`}
              />
              <span className="transition-colors duration-150">{item.label}</span>
              {active && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-teal-600/70 dark:text-[#00ffcc]/70 transition-transform duration-200 group-hover:translate-x-0.5" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="px-3 py-4 border-t border-slate-300/40 shadow-[0_-4px_10px_rgba(163,177,198,0.2)]">
        <div className="w-full p-3 rounded-2xl bg-white/45 dark:bg-white/[0.03] border border-white/70 dark:border-white/[0.08] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),1px_2px_6px_rgba(163,177,198,0.2)] backdrop-blur-md mb-2 flex flex-col items-center justify-center text-center">
          <p
            className="text-sm font-semibold text-slate-800 dark:text-slate-100 text-center leading-snug break-words max-w-full px-1"
            title={user.nama}
          >
            {user.nama}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2 font-medium text-center">
            {ROLE_LABELS[user.role]}
          </p>
          <div className="flex justify-center w-full">
            <span
              className="inline-block max-w-full px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-white/[0.06] text-[11px] font-medium text-slate-600 dark:text-slate-300 border border-slate-300/70 dark:border-white/[0.08] text-center leading-tight break-words"
              title={user.role === "superadmin" ? "Semua Bandara" : (getBandaraByKode(user.kode_bandara)?.nama || user.kode_bandara || "BDJ")}
            >
              {user.role === "superadmin" ? "Semua Bandara" : (getBandaraByKode(user.kode_bandara)?.nama || user.kode_bandara || "BDJ")}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <ThemeToggle variant="sidebar" className="mb-0.5" />
          <ChangePasswordModal />
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              Keluar
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header Bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-14 z-30 flex items-center justify-between px-3 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/70 dark:border-white/10 shadow-sm print:hidden">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-1 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link
            href={user.role === "carpark_manager" || user.role === "supervisor" ? "/dashboard" : "/berita-acara"}
            className="flex items-center gap-2"
          >
            <LaporParkLogo size="sm" interactive={false} />
            <span className="font-extrabold text-base text-slate-800 dark:text-white tracking-tight leading-none">
              Lapor<span className="text-emerald-500">Park</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle variant="icon" />
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-300/60 dark:border-white/10">
            {user.role === "superadmin" ? "Semua Bandara" : (user.kode_bandara || "BDJ")}
          </span>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm print:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)] dark:shadow-[4px_0_20px_rgba(0,0,0,0.6)] dark:border-white/[0.05] bg-background neo-card backdrop-blur-xl z-40 print:hidden">
        {sidebarContent}
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 border-r border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)] dark:shadow-[4px_0_20px_rgba(0,0,0,0.6)] dark:border-white/[0.05] bg-background neo-card backdrop-blur-xl transform transition-transform duration-300 ease-out print:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
