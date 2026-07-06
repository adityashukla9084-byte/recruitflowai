"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  History,
  BarChart3,
  User,
  Settings,
} from "lucide-react";

const items = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "History", href: "/history", icon: History },
  { name: "Analytics", href: "#", icon: BarChart3 },
  { name: "Profile", href: "#", icon: User },
  { name: "Settings", href: "#", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen bg-slate-950 border-r border-slate-800 p-6 sticky top-0">
      <h1 className="text-3xl font-bold text-cyan-400 mb-10">
        RecruitFlow AI
      </h1>

      <nav className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
            >
              <Icon size={22} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}