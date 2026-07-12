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
  return (
    <Link
      href={item.href}
      className={`relative flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${
        isActive
          ? "text-theme-text bg-indigo-500/10 border border-indigo-500/20 font-semibold shadow-[0_4px_12px_rgba(99,102,241,0.08)]"
          : "text-theme-text-secondary hover:text-theme-text hover:bg-theme-card-hover/70 hover:translate-x-0.5 font-normal"
      }`}
    >
      {isActive && (
        <motion.span
          layoutId="sidebarActiveBar"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
          style={{ backgroundColor: "var(--accent)" }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <Icon
        size={14}
        strokeWidth={isActive ? 2 : 1.75}
        className={`shrink-0 transition-colors duration-200 ${isActive ? "text-indigo-500" : "text-theme-text-muted group-hover:text-theme-text-secondary"}`}
      />
      <span>{item.name}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
        className={`fixed inset-y-0 left-0 z-50 w-60 h-screen bg-theme-sidebar/95 backdrop-blur-md border-r border-theme-border/40 flex flex-col justify-between py-6 px-4 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}
      >
        <div className="space-y-7">
          {/* Brand wordmark with dynamic glow */}
          <div className="flex items-center gap-2.5 px-3.5 pb-2 select-none">
            <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
              <span
                className="absolute w-4.5 h-4.5 rotate-45 border border-indigo-500/50 bg-indigo-500/10 rounded-[3px] animate-pulse"
              />
              <span
                className="absolute w-2 h-2 rotate-45 bg-gradient-to-tr from-violet-500 to-indigo-500 rounded-[1.5px]"
              />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 dark:from-violet-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent tracking-tight">
              RecruitFlow AI
            </span>
          </div>

          {/* Workspace navigation */}
          <nav className="space-y-1">
            <p className="px-3.5 mb-2.5 text-[10px] font-bold uppercase tracking-widest text-theme-text-muted/80 select-none">
              Workspace
            </p>
            {workspaceItems.map((item) => (
              <NavLink key={item.name} item={item} pathname={pathname} />
            ))}
          </nav>

          {/* Account navigation */}
          <nav className="space-y-1">
            <p className="px-3.5 mb-2.5 text-[10px] font-bold uppercase tracking-widest text-theme-text-muted/80 select-none">
              Account
            </p>
            {accountItems.map((item) => (
              <NavLink key={item.name} item={item} pathname={pathname} />
            ))}
          </nav>
        </div>

        {/* Log out */}
        <div className="border-t border-theme-border/40 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-theme-text-secondary hover:text-theme-text hover:bg-theme-card-hover/70 rounded-xl transition-all duration-200 cursor-pointer focus-visible:outline-2"
          >
            <LogOut size={14} strokeWidth={1.75} className="shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}