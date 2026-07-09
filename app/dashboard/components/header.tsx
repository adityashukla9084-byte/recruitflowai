"use client";

import { Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 h-[60px] flex items-center justify-between border-b border-theme-border/40 bg-theme-bg/75 backdrop-blur-md px-6 sm:px-10">
      <h1 className="text-sm font-bold text-theme-text tracking-wider uppercase opacity-85">
        Workspace
      </h1>

      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-card-hover hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus-visible:outline-2"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun size={15} strokeWidth={2} />
          ) : (
            <Moon size={15} strokeWidth={2} />
          )}
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-card-hover hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus-visible:outline-2"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={15} strokeWidth={2} />
          <span
            className="absolute top-[8px] right-[8px] w-2 h-2 rounded-full border border-theme-bg bg-emerald-500 animate-pulse"
          />
        </button>

        {/* User avatar with indigo gradient ring */}
        <div className="ml-2 flex items-center gap-2 pl-3 border-l border-theme-border/50">
          <div className="bg-gradient-to-tr from-violet-500 via-indigo-500 to-cyan-400 p-[1.5px] rounded-lg shadow-sm">
            <div className="w-[26px] h-[26px] rounded-[7px] bg-theme-bg flex items-center justify-center text-[10px] font-bold text-theme-text select-none">
              RF
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}