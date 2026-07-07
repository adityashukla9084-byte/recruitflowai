"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/app/context/ThemeContext";
import {
  Moon,
  Sun,
  Bell,
  Lock,
  LogOut,
  Trash2,
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  async function logout() {
    setLoading(true);

    await supabase.auth.signOut();

    window.location.href = "/";

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          ⚙️ Settings
        </h1>

        <div className="space-y-6">

          {/* ── Appearance Toggle ── */}
          <div className="rounded-2xl border border-theme-border-card bg-theme-card p-6 flex items-center justify-between shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-4">
              {theme === "dark" ? (
                <Moon className="text-theme-accent" />
              ) : (
                <Sun className="text-amber-500" />
              )}
              <div>
                <h2 className="text-xl font-bold">
                  Appearance
                </h2>

                <p className="text-theme-text-secondary">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </p>
              </div>
            </div>

            {/* Premium animated toggle switch */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className={`
                relative inline-flex h-8 w-16 items-center rounded-full
                transition-colors duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${theme === "dark"
                  ? "bg-cyan-500 focus:ring-cyan-400"
                  : "bg-amber-400 focus:ring-amber-300"
                }
              `}
              aria-label="Toggle theme"
            >
              <span
                className={`
                  inline-flex h-6 w-6 items-center justify-center
                  rounded-full bg-white shadow-md
                  transform transition-transform duration-300 ease-in-out
                  ${theme === "dark" ? "translate-x-9" : "translate-x-1"}
                `}
              >
                {theme === "dark" ? (
                  <Moon size={14} className="text-cyan-600" />
                ) : (
                  <Sun size={14} className="text-amber-500" />
                )}
              </span>
            </button>
          </div>

          {/* ── Email Notifications ── */}
          <div className="rounded-2xl border border-theme-border-card bg-theme-card p-6 flex items-center justify-between shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-4">
              <Bell className="text-theme-accent" />

              <div>
                <h2 className="text-xl font-bold">
                  Email Notifications
                </h2>

                <p className="text-theme-text-secondary">
                  Receive AI reports via email.
                </p>
              </div>
            </div>

            <button
              onClick={() => setNotifications(!notifications)}
              className={`
                relative inline-flex h-8 w-16 items-center rounded-full
                transition-colors duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${notifications
                  ? "bg-cyan-500 focus:ring-cyan-400"
                  : "bg-slate-600 focus:ring-slate-400"
                }
              `}
              aria-label="Toggle notifications"
            >
              <span
                className={`
                  inline-flex h-6 w-6 items-center justify-center
                  rounded-full bg-white shadow-md
                  transform transition-transform duration-300 ease-in-out
                  ${notifications ? "translate-x-9" : "translate-x-1"}
                `}
              />
            </button>
          </div>

          {/* ── Password ── */}
          <div className="rounded-2xl border border-theme-border-card bg-theme-card p-6 flex items-center justify-between shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-4">
              <Lock className="text-theme-accent" />

              <div>
                <h2 className="text-xl font-bold">
                  Password
                </h2>

                <p className="text-theme-text-secondary">
                  Change Password (Coming Soon)
                </p>
              </div>
            </div>
          </div>

          {/* ── Logout ── */}
          <div className="rounded-2xl border border-theme-border-card bg-theme-card p-6 flex items-center justify-between shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-4">
              <LogOut className="text-red-400" />

              <div>
                <h2 className="text-xl font-bold">
                  Logout
                </h2>

                <p className="text-theme-text-secondary">
                  Sign out from RecruitFlow AI
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              disabled={loading}
              className="rounded-lg bg-red-500 px-6 py-2 font-semibold text-white hover:bg-red-600"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>

          {/* ── Delete Account ── */}
          <div className="rounded-2xl border border-red-900 bg-theme-card p-6 flex items-center justify-between shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-4">
              <Trash2 className="text-red-500" />

              <div>
                <h2 className="text-xl font-bold text-red-400">
                  Delete Account
                </h2>

                <p className="text-theme-text-secondary">
                  Coming Soon
                </p>
              </div>
            </div>

            <button
              disabled
              className="rounded-lg bg-red-700 px-6 py-2 font-semibold text-white opacity-60"
            >
              Delete
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}
