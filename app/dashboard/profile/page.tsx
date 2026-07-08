"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Building, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [profile, setProfile] = useState({
    id: null as any,
    full_name: "",
    phone: "",
    education: "",
    university: "",
    bio: "",
    email: "",
  });

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && active) {
        supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .then(({ data, error }) => {
            if (active) {
              if (error) console.error(error);
              const profileData = data && data.length > 0 ? data[0] : null;
              if (profileData) {
                setProfile({
                  id: profileData.id || null,
                  full_name: profileData.full_name || "",
                  phone: profileData.phone || "",
                  education: profileData.education || "",
                  university: profileData.university || "",
                  bio: profileData.bio || "",
                  email: user.email || "",
                });
              } else {
                setProfile((prev) => ({
                  ...prev,
                  email: user.email || "",
                }));
              }
              setLoading(false);
            }
          });
      } else {
        if (active) {
          setLoading(false);
        }
      }
    });
    return () => {
      active = false;
    };
  }, []);

  async function saveProfile() {
    setSaving(true);
    setSaveStatus("idle");

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setSaveStatus("error");
        setErrorMessage("User session not found. Please log in again.");
        setSaving(false);
        return;
      }

      const payload: any = {
        user_id: user.id,
        full_name: profile.full_name,
        phone: profile.phone,
        education: profile.education,
        university: profile.university,
        bio: profile.bio,
      };

      if (profile.id) {
        payload.id = profile.id;
      }

      const { error } = await supabase
        .from("profiles")
        .upsert(payload);

      if (error) {
        setSaveStatus("error");
        setErrorMessage(error.message);
      } else {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (err: any) {
      setSaveStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
          <span className="text-sm font-medium text-theme-text-secondary">Loading Profile...</span>
        </div>
      </main>
    );
  }

  const initials = profile.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "RF";

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text p-6 sm:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Profile Card Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-theme-border bg-theme-card/45 backdrop-blur-xl p-8 shadow-[var(--shadow-card)] flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-theme-border/40 select-none">
            {initials}
          </div>
          <div className="text-center sm:text-left flex-1 space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">{profile.full_name || "New Candidate"}</h2>
            <p className="text-sm text-theme-text-secondary font-medium">{profile.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-theme-accent/15 text-theme-accent border border-theme-accent/25 px-2.5 py-0.5 rounded-full">
                Candidate Account
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Active
              </span>
            </div>
          </div>
        </motion.div>

        {/* Form panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-theme-border bg-theme-card/45 backdrop-blur-xl p-8 shadow-[var(--shadow-card)] space-y-6"
        >
          <h1 className="text-xl font-bold tracking-tight pb-3 border-b border-theme-border/60">
            Personal Information
          </h1>

          <AnimatePresence>
            {saveStatus === "success" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-500 flex items-center gap-2"
              >
                <CheckCircle className="h-4.5 w-4.5 shrink-0" />
                <span>Profile updated successfully!</span>
              </motion.div>
            )}

            {saveStatus === "error" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500 flex items-center gap-2"
              >
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>Failed to save: {errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-4.5 w-4.5 text-theme-text-muted" />
                <input
                  className="w-full rounded-xl border border-theme-border bg-theme-card-hover/20 py-3.5 pl-11 pr-4 text-sm text-theme-text outline-none focus:border-theme-accent/50 focus:ring-1 focus:ring-theme-accent/30 transition duration-200"
                  placeholder="John Doe"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                />
              </div>
            </div>

            {/* Email (Disabled) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-4.5 w-4.5 text-theme-text-muted" />
                <input
                  className="w-full rounded-xl border border-theme-border bg-theme-card-hover/10 py-3.5 pl-11 pr-4 text-sm text-theme-text-muted outline-none cursor-not-allowed select-none"
                  value={profile.email}
                  disabled
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 h-4.5 w-4.5 text-theme-text-muted" />
                <input
                  className="w-full rounded-xl border border-theme-border bg-theme-card-hover/20 py-3.5 pl-11 pr-4 text-sm text-theme-text outline-none focus:border-theme-accent/50 focus:ring-1 focus:ring-theme-accent/30 transition duration-200"
                  placeholder="+1 (555) 123-4567"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Education Degree */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wider">Highest Degree</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-3.5 h-4.5 w-4.5 text-theme-text-muted" />
                <input
                  className="w-full rounded-xl border border-theme-border bg-theme-card-hover/20 py-3.5 pl-11 pr-4 text-sm text-theme-text outline-none focus:border-theme-accent/50 focus:ring-1 focus:ring-theme-accent/30 transition duration-200"
                  placeholder="Master of Computer Applications"
                  value={profile.education}
                  onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                />
              </div>
            </div>

            {/* University */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wider">University / Institution</label>
              <div className="relative">
                <Building className="absolute left-4 top-3.5 h-4.5 w-4.5 text-theme-text-muted" />
                <input
                  className="w-full rounded-xl border border-theme-border bg-theme-card-hover/20 py-3.5 pl-11 pr-4 text-sm text-theme-text outline-none focus:border-theme-accent/50 focus:ring-1 focus:ring-theme-accent/30 transition duration-200"
                  placeholder="Harvard University"
                  value={profile.university}
                  onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                />
              </div>
            </div>

            {/* Bio / Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wider">Professional Bio</label>
              <div className="relative">
                <FileText className="absolute left-4 top-3.5 h-4.5 w-4.5 text-theme-text-muted" />
                <textarea
                  className="w-full rounded-xl border border-theme-border bg-theme-card-hover/20 py-3.5 pl-11 pr-4 text-sm text-theme-text outline-none focus:border-theme-accent/50 focus:ring-1 focus:ring-theme-accent/30 transition duration-200 resize-none leading-relaxed"
                  rows={4}
                  placeholder="Describe your career goals, key specialties, or technical expertise..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={saveProfile}
              disabled={saving}
              className={`rounded-2xl px-6 py-3.5 font-bold text-white transition duration-300 flex items-center gap-2 cursor-pointer ${
                saving
                  ? "bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-transparent"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/15 active:scale-[0.995]"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4.5 w-4.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}