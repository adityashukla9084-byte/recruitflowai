"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Video, BarChart3, Settings } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Candidates", href: "/dashboard/candidates", icon: Users },
  { name: "Interviews", href: "/dashboard/interview", icon: Video },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  // Define routes where we want to show the bottom navigation bar
  const showNav =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/history") ||
    pathname?.startsWith("/profile");

  if (!showNav) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-theme-bg/80 border-t border-theme-border backdrop-blur-lg px-6 py-2 pb-safe-bottom shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Determine active status:
          // For dashboard, match exactly (since /dashboard/analytics, etc are separate)
          // For other routes, check if pathname starts with the item's href
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-colors duration-200 cursor-pointer"
            >
              {/* Sliding Active Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavActivePill"
                  className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-[#C5A028]/10 border border-[#D4AF37]/20 rounded-xl -z-10 shadow-[0_2px_8px_rgba(20,184,166,0.08)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon with scale effect on active */}
              <motion.div
                animate={{ scale: isActive ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`transition-colors duration-200 ${isActive ? "text-[#D4AF37]" : "text-zinc-300"}`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.25 : 1.75} />
              </motion.div>

              {/* Active Glow Dot */}
              {isActive && (
                <motion.span
                  layoutId="bottomNavActiveDot"
                  className="w-1 h-1 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] rounded-full shadow-[0_0_6px_rgba(20,184,166,0.8)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Label */}
              <span className={`text-[9px] font-bold tracking-wide uppercase transition-colors duration-200 ${
                isActive ? "text-[#FFFFF0]" : "text-zinc-300"
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
