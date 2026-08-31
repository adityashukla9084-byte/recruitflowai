"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "../../components/Logo";
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
          ? "text-theme-accent-hover font-bold"
          : "text-theme-text-secondary hover:text-theme-text font-medium"
      }`}
    >
      {isActive && (
        <motion.span
          layoutId="sidebarActiveBackground"
          className="absolute inset-0 bg-theme-accent/10 border border-theme-accent/20 rounded-xl -z-10 shadow-[var(--shadow-card)]"
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        />
      )}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-theme-accent to-theme-accent-hover rounded-r-full shadow-[var(--shadow-card)]" />
      )}
      {!isActive && isHovered && (
        <span
          className="absolute inset-0 bg-theme-text/5 border border-theme-text/10 rounded-xl -z-10"
        />
      )}
      <Icon
        size={15}
        strokeWidth={isActive ? 2 : 1.75}
        className={`shrink-0 transition-colors duration-200 ${isActive ? "text-theme-accent-hover" : "text-theme-text-secondary group-hover:text-theme-text"}`}
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
          className="fixed inset-0 bg-black/10  z-40 md:hidden transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 h-screen bg-theme-sidebar  border-r border-theme-border flex flex-col justify-between py-6 px-4 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } shadow-[var(--shadow-card)]`}
      >
        <div className="space-y-7 relative z-10">
          {/* Brand wordmark */}
          <div className="flex flex-col gap-1 px-3.5 pb-3 border-b border-theme-border select-none">
            <Logo size={24} fontWeight="font-black" />
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] font-black uppercase tracking-[0.15em] bg-theme-accent/10 text-theme-accent-hover px-1.5 py-0.5 rounded border border-theme-accent/25">
                PRO PLATFORM
              </span>
            </div>
          </div>

          {/* Workspace navigation */}
          <nav className="space-y-1">
            <p className="px-3.5 mb-2.5 text-xs font-black uppercase tracking-[0.18em] text-theme-text-muted select-none">
              Workspace
            </p>
            {workspaceItems.map((item) => (
              <NavLink key={item.name} item={item} pathname={pathname} />
            ))}
          </nav>

          {/* Account navigation */}
          <nav className="space-y-1">
            <p className="px-3.5 mb-2.5 text-xs font-black uppercase tracking-[0.18em] text-theme-text-muted select-none">
              Account
            </p>
            {accountItems.map((item) => (
              <NavLink key={item.name} item={item} pathname={pathname} />
            ))}
          </nav>
        </div>

        {/* User Card & Log out */}
        <div className="border-t border-theme-border pt-4 mt-auto space-y-3 relative z-10">
          {userEmail && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-theme-text/5 border border-theme-border rounded-xl select-none">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-theme-accent/15 to-theme-accent/5 border border-theme-accent/30 flex items-center justify-center text-xs font-bold text-theme-accent-hover font-mono shrink-0">
                {userEmail.slice(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-[11px] text-theme-text-secondary font-black uppercase tracking-wider leading-none">Account Active</p>
                <p className="text-xs text-theme-text truncate font-mono mt-0.5">{userEmail}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-theme-text-secondary hover:text-theme-text hover:bg-theme-text/5 border border-transparent hover:border-theme-border rounded-xl transition-all duration-300 cursor-pointer focus-visible:outline-2"
          >
            <LogOut size={14} strokeWidth={2} className="shrink-0 text-theme-text-secondary group-hover:text-theme-text" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
