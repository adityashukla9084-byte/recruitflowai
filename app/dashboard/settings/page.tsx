"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/app/context/ThemeContext";
import {
  Moon,
  Sun,
  Bell,
  Lock,
  LogOut,
  Trash2,
  ChevronDown,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Load notification setting from Supabase on mount
  useEffect(() => {
    let active = true;

    async function loadNotificationSetting() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !active) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("email_reports")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) {
        setNotifications(profile.email_reports ?? false);
      } else if (user.user_metadata?.email_reports !== undefined) {
        setNotifications(user.user_metadata.email_reports ?? false);
      } else {
        setNotifications(false);
      }
    }

    loadNotificationSetting();

    return () => {
      active = false;
    };
  }, []);

  // Update notification setting in Supabase
  async function handleToggleNotifications() {
    const nextVal = !notifications;
    setNotifications(nextVal);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // 1. Update user metadata in auth (used by backend email pipeline)
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          email_reports: nextVal,
        },
      });

      if (authError) {
        console.error("Failed to update auth user metadata:", authError.message);
      }

      // 2. Upsert profile row (ensures row exists and updates email_reports column)
      const { error: dbError } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          email_reports: nextVal,
        }, { onConflict: "user_id" });

      if (dbError) {
        console.error("Failed to update database profile:", dbError.message);
        setNotifications(!nextVal);
      }
    } catch (err) {
      console.error("Failed to save notification preference:", err);
      setNotifications(!nextVal);
    }
  }

  // ── Change Password state ──
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // ── Delete Account state ──
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleDeleteAccount() {
    setDeleteError("");

    if (!deletePassword) {
      setDeleteError("Please enter your password to confirm deletion.");
      return;
    }

    setDeleteLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user?.email) {
        setDeleteError("Unable to identify current user. Please log in again.");
        setDeleteLoading(false);
        return;
      }

      // Verify credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: deletePassword,
      });

      if (signInError) {
        setDeleteError("Incorrect password.");
        setDeleteLoading(false);
        return;
      }

      const token = signInData.session?.access_token;
      if (!token) {
        setDeleteError("Authentication session expired.");
        setDeleteLoading(false);
        return;
      }

      // Call delete-account API
      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setDeleteError(data.error || "Failed to delete account.");
      } else {
        // Sign out client-side and redirect
        await supabase.auth.signOut();
        window.location.href = "/";
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong.";
      setDeleteError(errorMsg);
    }

    setDeleteLoading(false);
  }

  async function handleChangePassword() {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password.");
      return;
    }

    setPasswordLoading(true);

    try {
      // Verify current password by re-authenticating
      const { data: { user } } = await supabase.auth.getUser();

      if (!user?.email) {
        setPasswordError("Unable to get user info. Please log in again.");
        setPasswordLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        setPasswordError("Current password is incorrect.");
        setPasswordLoading(false);
        return;
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setPasswordError(updateError.message);
      } else {
        setPasswordSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setShowPasswordForm(false);
          setPasswordSuccess("");
        }, 2500);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong.";
      setPasswordError(errorMsg);
    }

    setPasswordLoading(false);
  }

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
              onClick={handleToggleNotifications}
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
          <div className="rounded-2xl border border-theme-border-card bg-theme-card shadow-[var(--shadow-card)] overflow-hidden">
            <div
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-theme-card-hover"
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                setPasswordError("");
                setPasswordSuccess("");
              }}
            >
              <div className="flex items-center gap-4">
                <Lock className="text-theme-accent" />

                <div>
                  <h2 className="text-xl font-bold">
                    Password
                  </h2>

                  <p className="text-theme-text-secondary">
                    Change your account password
                  </p>
                </div>
              </div>

              <ChevronDown
                className={`text-theme-text-secondary transition-transform duration-300 ${
                  showPasswordForm ? "rotate-180" : ""
                }`}
                size={20}
              />
            </div>

            {/* Collapsible password form */}
            <div
              style={{
                maxHeight: showPasswordForm ? "500px" : "0px",
                opacity: showPasswordForm ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.4s ease, opacity 0.3s ease",
              }}
            >
              <div className="px-6 pb-6 space-y-4 border-t border-theme-border-card pt-5">

                {/* Error message */}
                {passwordError && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 flex items-center gap-2">
                    <span>⚠️</span> {passwordError}
                  </div>
                )}

                {/* Success message */}
                {passwordSuccess && (
                  <div className="rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-400 flex items-center gap-2">
                    <Check size={16} /> {passwordSuccess}
                  </div>
                )}

                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? "text" : "password"}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-lg border border-theme-border-input bg-theme-input p-3 pr-11 text-theme-text focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-text-secondary"
                    >
                      {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPw ? "text" : "password"}
                      placeholder="Enter new password (min 6 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-theme-border-input bg-theme-input p-3 pr-11 text-theme-text focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-text-secondary"
                    >
                      {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
                    className={`w-full rounded-lg border bg-theme-input p-3 text-theme-text focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 ${
                      confirmPassword && confirmPassword !== newPassword
                        ? "border-red-500/50"
                        : "border-theme-border-input"
                    }`}
                  />
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleChangePassword}
                    disabled={passwordLoading}
                    className="rounded-lg bg-cyan-500 px-6 py-2.5 font-semibold text-white hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {passwordLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Update Password
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setPasswordError("");
                      setPasswordSuccess("");
                    }}
                    className="rounded-lg border border-theme-border-card px-6 py-2.5 font-semibold text-theme-text-secondary hover:bg-theme-card-hover"
                  >
                    Cancel
                  </button>
                </div>

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
          <div className="rounded-2xl border border-red-900/50 bg-theme-card shadow-[var(--shadow-card)] overflow-hidden">
            <div
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-red-950/10"
              onClick={() => {
                setShowDeleteConfirm(!showDeleteConfirm);
                setDeletePassword("");
                setDeleteError("");
              }}
            >
              <div className="flex items-center gap-4">
                <Trash2 className="text-red-500" />

                <div>
                  <h2 className="text-xl font-bold text-red-400">
                    Delete Account
                  </h2>

                  <p className="text-theme-text-secondary">
                    Permanently delete your RecruitFlow AI account
                  </p>
                </div>
              </div>

              <ChevronDown
                className={`text-red-400 transition-transform duration-300 ${
                  showDeleteConfirm ? "rotate-180" : ""
                }`}
                size={20}
              />
            </div>

            {/* Collapsible delete confirmation */}
            <div
              style={{
                maxHeight: showDeleteConfirm ? "350px" : "0px",
                opacity: showDeleteConfirm ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.4s ease, opacity 0.3s ease",
              }}
            >
              <div className="px-6 pb-6 space-y-4 border-t border-red-950/20 pt-5">
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                  ⚠️ <strong>Warning:</strong> Deleting your account is permanent. All your resumes, tracker entries, and interview reports will be deleted immediately.
                </div>

                {deleteError && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                    ❌ {deleteError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-1.5">
                    Enter Password to Confirm
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your current password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full rounded-lg border border-red-900/30 bg-theme-input p-3 text-theme-text focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="rounded-lg bg-red-600 px-6 py-2.5 font-semibold text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {deleteLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Deleting Account...
                      </>
                    ) : (
                      "Confirm Permanent Deletion"
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword("");
                      setDeleteError("");
                    }}
                    className="rounded-lg border border-theme-border-card px-6 py-2.5 font-semibold text-theme-text-secondary hover:bg-theme-card-hover"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}