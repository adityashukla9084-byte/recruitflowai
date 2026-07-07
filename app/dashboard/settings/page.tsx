"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Moon,
  Bell,
  Lock,
  LogOut,
  Trash2,
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);

    await supabase.auth.signOut();

    window.location.href = "/";

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          ⚙️ Settings
        </h1>

        <div className="space-y-6">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Moon className="text-cyan-400" />
              <div>
                <h2 className="text-xl font-bold">
                  Appearance
                </h2>

                <p className="text-slate-400">
                  Dark Mode (Coming Soon)
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Bell className="text-cyan-400" />

              <div>
                <h2 className="text-xl font-bold">
                  Email Notifications
                </h2>

                <p className="text-slate-400">
                  Receive AI reports via email.
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={notifications}
              onChange={() =>
                setNotifications(!notifications)
              }
              className="h-5 w-5"
            />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Lock className="text-cyan-400" />

              <div>
                <h2 className="text-xl font-bold">
                  Password
                </h2>

                <p className="text-slate-400">
                  Change Password (Coming Soon)
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LogOut className="text-red-400" />

              <div>
                <h2 className="text-xl font-bold">
                  Logout
                </h2>

                <p className="text-slate-400">
                  Sign out from RecruitFlow AI
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              disabled={loading}
              className="rounded-lg bg-red-500 px-6 py-2 font-semibold hover:bg-red-600"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>

          <div className="rounded-2xl border border-red-900 bg-slate-900 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Trash2 className="text-red-500" />

              <div>
                <h2 className="text-xl font-bold text-red-400">
                  Delete Account
                </h2>

                <p className="text-slate-400">
                  Coming Soon
                </p>
              </div>
            </div>

            <button
              disabled
              className="rounded-lg bg-red-700 px-6 py-2 font-semibold opacity-60"
            >
              Delete
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}