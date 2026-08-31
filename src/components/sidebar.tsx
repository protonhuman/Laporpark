"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";
import type { User } from "@/lib/types";
import { ROLE_LABELS } from "@/lib/types";
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
      return user.role === "carpark_manager" || user.role === "supervisor" || user.role === "admin";
    }
    return true;
  });
  if (user.role === "supervisor" || user.role === "admin") {
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
      {/* Brand */}
      <div className="px-6 py-5 border-b border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)]">
        <div className="flex items-center justify-between">
          <Link href={user.role === "carpark_manager" || user.role === "supervisor" ? "/dashboard" : "/berita-acara"} className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ffcc] to-[#39ff14] shadow-lg shadow-[#00ffcc]/30">
              <ShieldCheck className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                Lapor Park
              </h1>
              <p className="text-[11px] text-slate-500 leading-none">
                Berita Acara Digital
              </p>
            </div>
          </Link>
          
          {/* Close Button for Mobile inside Sidebar */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 -mr-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/[0.04] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Corporate Identity Logos */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-200/40">
          <img src="/logo-aps.png" alt="Angkasa Pura Supports" className="h-7 w-auto object-contain drop-shadow-sm" />
          <img src="/logo-cp.png" alt="Centre Park" className="h-5 w-auto object-contain drop-shadow-sm" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-[#00ffcc]/10 text-[#00ffcc] shadow-sm shadow-[#00ffcc]/10"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/[0.04]"
              }`}
            >
              <item.icon
                className={`w-[18px] h-[18px] ${
                  active
                    ? "text-[#00ffcc]"
                    : "text-slate-500 group-hover:text-slate-600"
                }`}
              />
              {item.label}
              {active && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-sky-500/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="px-3 py-4 border-t border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)]">
        <div className="px-3 py-3 rounded-xl bg-white/[0.03] mb-2 text-center">
          <p className="text-sm font-medium text-slate-800 truncate">
            {user.nama}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {ROLE_LABELS[user.role]}
          </p>
        </div>
        <ChangePasswordModal />
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </form>


      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      {!mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-800 backdrop-blur-xl cursor-pointer print:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm print:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)] bg-background neo-card backdrop-blur-xl z-40 print:hidden">
        {sidebarContent}
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-72 border-r border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)] bg-background neo-card backdrop-blur-xl transform transition-transform duration-300 ease-out print:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
