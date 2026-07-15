"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  History,
  BarChart3,
  User,
  Settings,
  LogOut,
  Cpu,
} from "lucide-react";
import { motion } from "framer-motion";

const workspaceItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "History", href: "/history", icon: History },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const accountItems = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

type NavItem = { name: string; href: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> };

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon;
  const isActive = pathname === item.href;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={item.href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 ${
        isActive
          ? "text-white font-bold"
          : "text-slate-400 hover:text-white font-medium"
      }`}
    >
      {isActive && (
        <motion.span
          layoutId="sidebarActiveBackground"
          className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-xl -z-10 shadow-[0_4px_12px_rgba(20,184,166,0.06)]"
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        />
      )}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-r-full shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
      )}
      {!isActive && isHovered && (
        <span
          className="absolute inset-0 bg-white/[0.03] border border-white/[0.04] rounded-xl -z-10"
        />
      )}
      <Icon
        size={15}
        strokeWidth={isActive ? 2 : 1.75}
        className={`shrink-0 transition-colors duration-200 ${isActive ? "text-teal-400" : "text-slate-400"}`}
      />
      <span>{item.name}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleClose = () => setIsOpen(false);

    window.addEventListener("toggle-sidebar", handleToggle);
    window.addEventListener("close-sidebar", handleClose);

    return () => {
      window.removeEventListener("toggle-sidebar", handleToggle);
      window.removeEventListener("close-sidebar", handleClose);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
      }
    }
    loadUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 h-screen bg-[#070b19]/95 backdrop-blur-md border-r border-white/[0.06] flex flex-col justify-between py-6 px-4 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } shadow-[4px_0_24px_rgba(0,0,0,0.15)]`}
      >
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(20,184,166,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="space-y-7 relative z-10">
          {/* Brand wordmark with dynamic glow */}
          <div className="flex flex-col gap-1 px-3.5 pb-3 border-b border-white/[0.04] select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                <span className="absolute w-4.5 h-4.5 rotate-45 border border-teal-500/50 bg-teal-500/10 rounded-[3px] animate-pulse" />
                <span className="absolute w-2 h-2 rotate-45 bg-gradient-to-tr from-teal-500 to-cyan-500 rounded-[1.5px]" />
              </div>
              <span className="text-sm font-black bg-gradient-to-r from-teal-400 via-cyan-300 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                RecruitFlow AI
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[9px] font-black uppercase tracking-[0.15em] bg-teal-400/10 text-teal-300 px-1.5 py-0.5 rounded border border-teal-500/25">
                PRO PLATFORM
              </span>
            </div>
          </div>

          {/* Workspace navigation */}
          <nav className="space-y-1">
            <p className="px-3.5 mb-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 select-none">
              Workspace
            </p>
            {workspaceItems.map((item) => (
              <NavLink key={item.name} item={item} pathname={pathname} />
            ))}
          </nav>

          {/* Account navigation */}
          <nav className="space-y-1">
            <p className="px-3.5 mb-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 select-none">
              Account
            </p>
            {accountItems.map((item) => (
              <NavLink key={item.name} item={item} pathname={pathname} />
            ))}
          </nav>
        </div>

        {/* User Card & Log out */}
        <div className="border-t border-white/[0.06] pt-4 mt-auto space-y-3 relative z-10">
          {userEmail && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white/[0.015] border border-white/[0.04] rounded-xl select-none">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500/15 to-cyan-500/15 border border-teal-500/30 flex items-center justify-center text-xs font-bold text-teal-300 font-mono shrink-0">
                {userEmail.slice(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider leading-none">Account Active</p>
                <p className="text-xs text-slate-300 truncate font-mono mt-0.5">{userEmail}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent hover:border-white/[0.04] rounded-xl transition-all duration-300 cursor-pointer focus-visible:outline-2"
          >
            <LogOut size={14} strokeWidth={2} className="shrink-0 text-slate-400 group-hover:text-white" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}