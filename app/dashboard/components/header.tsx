"use client";

import { Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-theme-border bg-theme-bg/50 backdrop-blur-md px-8 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-theme-text-secondary">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-theme-border bg-theme-card-hover/20 text-theme-text hover:text-theme-accent hover:border-theme-accent/30 transition-all duration-300 cursor-pointer"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun className="h-[18px] w-[18px] transition-transform duration-500 hover:rotate-45" />
          ) : (
            <Moon className="h-[18px] w-[18px] transition-transform duration-500 hover:-rotate-12" />
          )}
        </button>

        {/* Notifications Icon */}
        <button
          className="p-2.5 rounded-xl border border-theme-border bg-theme-card-hover/20 text-theme-text-secondary hover:text-theme-accent hover:border-theme-accent/30 transition-all duration-300 relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-background animate-pulse" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-theme-border/60">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white text-sm shadow-md ring-2 ring-theme-border">
            RF
          </div>
        </div>
      </div>
    </header>
  );
}