"use client";

import { Bell, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl px-8 py-5">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-400">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-5">
        <Bell className="text-cyan-400" size={24} />
        <UserCircle className="text-cyan-400" size={34} />
      </div>
    </header>
  );
}