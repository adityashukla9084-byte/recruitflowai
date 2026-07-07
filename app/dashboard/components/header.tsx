"use client";

import { Bell, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-theme-border-card bg-theme-bg/80 backdrop-blur-xl px-8 py-5">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-theme-text-secondary">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-5">
        <Bell className="text-theme-accent" size={24} />
        <UserCircle className="text-theme-accent" size={34} />
      </div>
    </header>
  );
}