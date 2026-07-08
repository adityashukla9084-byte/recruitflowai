"use client";

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
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "History", href: "/history", icon: History },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-72 h-screen bg-theme-sidebar/80 backdrop-blur-xl border-r border-theme-border flex flex-col justify-between p-6 sticky top-0 z-30">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="text-white h-5 w-5" />
          </div>
          <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-400 tracking-tight">
            RecruitFlow
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 group ${
                  isActive
                    ? "text-theme-accent bg-theme-card-hover shadow-[var(--shadow-card)]"
                    : "text-theme-text-secondary hover:text-theme-text hover:bg-theme-card-hover/40"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-6 bg-gradient-to-b from-indigo-500 to-cyan-400 rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  size={20}
                  className={`transition-colors duration-300 ${
                    isActive ? "text-theme-accent" : "text-theme-text-muted group-hover:text-theme-text-secondary"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="pt-6 border-t border-theme-border/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}