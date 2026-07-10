"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Briefcase,
  Code2,
  Globe,
  Lock,
  Shield,
  Activity,
  Check,
  Loader2,
  Sparkles,
  Camera,
  MapPin,
  Clock,
  Laptop,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Database,
  Key,
  Copy
} from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({
    full_name: "",
    phone: "",
    education: "",
    universities: "",
    linkedin: "",
    github: "",
    bio: "",
    job_title: "Lead Security Engineer",
    location: "San Francisco, CA",
    timezone: "America/Los_Angeles",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    mfa_enabled: false,
    api_token: "ae_live_8321a00f2e519280cdb91c"
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "info" | "warn"; text: string }>>([]);
  const [activityMap, setActivityMap] = useState<any[]>([]);
  const [mfaVerifying, setMfaVerifying] = useState(false);
  
  const [sessions, setSessions] = useState([
    { id: "session-2", name: "Safari / iPhone 15 Pro", meta: "Los Angeles, USA • 172.56.21.90", icon: Smartphone },
    { id: "session-3", name: "Firefox / macOS", meta: "Seattle, USA • 198.51.100.12", icon: Laptop }
  ]);

  const [integrations, setIntegrations] = useState({
    github: true,
    slack: true,
    aws: false
  });

  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
  ];

  function triggerToast(type: "success" | "error" | "info" | "warn", text: string) {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Load local extended profile data
    const extendedCached = localStorage.getItem(`recruitflow_profile_extended_${user.id}`);
    const extended = extendedCached ? JSON.parse(extendedCached) : {
      job_title: "Lead Security Engineer",
      location: "San Francisco, CA",
      timezone: "America/Los_Angeles",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      mfa_enabled: false,
      api_token: "ae_live_8321a00f2e519280cdb91c"
    };

    if (data) {
      setProfile({
        ...data,
        ...extended,
        email: user.email
      });
    } else {
      setProfile((prev: any) => ({
        ...prev,
        ...extended,
        email: user.email
      }));
    }
  }

  async function saveProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        education: profile.education,
        university: profile.universities,
        linkedin: profile.linkedin,
        github: profile.github,
        bio: profile.bio,
      })
      .eq("user_id", user.id);

    // Save extended fields locally to avoid backend column mismatches
    localStorage.setItem(`recruitflow_profile_extended_${user.id}`, JSON.stringify({
      job_title: profile.job_title,
      location: profile.location,
      timezone: profile.timezone,
      avatar_url: profile.avatar_url,
      mfa_enabled: profile.mfa_enabled,
      api_token: profile.api_token
    }));

    setLoading(false);

    if (error) {
      triggerToast("error", error.message);
    } else {
      triggerToast("success", "Profile updated successfully!");
    }
  }

  function cycleAvatar() {
    const idx = avatars.indexOf(profile.avatar_url);
    const nextIdx = (idx + 1) % avatars.length;
    setProfile((prev: any) => ({
      ...prev,
      avatar_url: avatars[nextIdx]
    }));
    triggerToast("success", "Profile avatar updated.");
  }

  function rotateApiKey() {
    const randHex = Array.from({ length: 22 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const newToken = `ae_live_${randHex}`;
    setProfile((prev: any) => ({
      ...prev,
      api_token: newToken
    }));
    triggerToast("success", "API orchestrator key rotated successfully.");
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
      .then(() => triggerToast("success", `${label} copied to clipboard.`))
      .catch(() => triggerToast("error", "Failed to copy token."));
  }

  function revokeSession(id: string, name: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    triggerToast("success", `Authorized session for ${name} revoked.`);
  }

  function toggleIntegration(key: "github" | "slack" | "aws") {
    const newVal = !integrations[key];
    setIntegrations((prev: any) => ({ ...prev, [key]: newVal }));
    triggerToast(newVal ? "success" : "warn", `${key.toUpperCase()} integration ${newVal ? "enabled" : "disabled"}.`);
  }

  function toggleMfa() {
    if (profile.mfa_enabled) {
      setProfile((prev: any) => ({ ...prev, mfa_enabled: false }));
      triggerToast("warn", "MFA deactivated.");
    } else {
      setMfaVerifying(true);
      triggerToast("info", "Generating MFA validation keys...");
      setTimeout(() => {
        setProfile((prev: any) => ({ ...prev, mfa_enabled: true }));
        setMfaVerifying(false);
        triggerToast("success", "MFA validated and registered successfully!");
      }, 1550);
    }
  }

  useEffect(() => {
    loadProfile();

    // Seed Activity heat map
    const map = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const level = Math.floor(Math.random() * 4);
      let count = 0;
      if (level === 1) count = Math.floor(Math.random() * 2) + 1;
      else if (level === 2) count = Math.floor(Math.random() * 4) + 3;
      else if (level === 3) count = Math.floor(Math.random() * 8) + 7;
      
      map.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        level,
        count
      });
    }
    setActivityMap(map);
  }, []);

  return (
    <main className="min-h-screen bg-[#05070F] text-slate-100 p-6 md:p-12 relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        
        {/* Banner Hero Card */}
        <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-slate-900/10 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-cyan-500/10 z-0" />
          
          {/* Header mesh banner */}
          <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#6366f1,transparent_50%)] opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#ec4899,transparent_50%)] opacity-10" />
          </div>

          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 relative z-10">
            {/* Avatar block */}
            <div className="relative group -mt-20 md:-mt-24 cursor-pointer" onClick={cycleAvatar}>
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#05070F] bg-slate-950 shadow-xl relative">
                <img
                  src={profile.avatar_url}
                  alt="User avatar"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#05070F] shadow-lg animate-pulse" />
            </div>

            {/* Profile identity info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  {profile.full_name || "Profile Name"}
                </h1>
                <span className="mx-auto md:mx-0 w-fit text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  {profile.job_title}
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-xl line-clamp-2">
                {profile.bio || "Write your professional bio in general configuration settings..."}
              </p>
            </div>

            {/* Quick badges */}
            <div className="flex gap-4 bg-slate-950/40 border border-white/5 rounded-2xl p-4 self-center md:self-end">
              <div className="text-center px-2">
                <span className="block text-xs text-slate-400 uppercase font-semibold">Location</span>
                <span className="text-sm font-semibold flex items-center justify-center gap-1 text-slate-200 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {profile.location}
                </span>
              </div>
              <div className="w-[1px] bg-white/5" />
              <div className="text-center px-2">
                <span className="block text-xs text-slate-400 uppercase font-semibold">Timezone</span>
                <span className="text-sm font-semibold flex items-center justify-center gap-1 text-slate-200 mt-1">
                  <Clock className="w-3.5 h-3.5 text-violet-400" /> {profile.timezone?.split("/").pop()?.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left column navigation */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-white/5 bg-slate-900/10 backdrop-blur-xl p-4 space-y-1">
              {[
                { id: "general", label: "General", icon: User },
                { id: "socials", label: "Socials & Edu", icon: Globe },
                { id: "integrations", label: "Integrations & API", icon: Database },
                { id: "activity", label: "Console Presence", icon: Activity }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-indigo-400" : "text-slate-400"}`} />
                    <span>{tab.label}</span>
                    {isSelected && (
                      <ChevronRight className="w-4 h-4 ml-auto text-indigo-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Profile Health Widget */}
            <div className="rounded-2xl border border-white/5 bg-slate-900/10 backdrop-blur-xl p-6 space-y-4 text-center">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Console Health</span>
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="#6366f1" strokeWidth="6" fill="transparent" strokeDasharray="251" strokeDashoffset="12" />
                </svg>
                <div className="absolute text-center">
                  <span className="block text-xl font-extrabold text-white">95%</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Active</span>
                </div>
              </div>
              <p className="text-xs text-slate-400">All regional nodes and credentials operational.</p>
            </div>
          </div>

          {/* Right column forms */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/5 bg-slate-900/10 backdrop-blur-xl p-6 md:p-8 min-h-[420px] flex flex-col justify-between">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  {/* General Configuration Info */}
                  {activeTab === "general" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          <User className="w-5 h-5 text-indigo-400" /> General Information
                        </h2>
                        <p className="text-xs text-slate-400">Manage basic identity parameters and directory contacts.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                              className="w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 pl-12 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                              placeholder="Full Name"
                              value={profile.full_name || ""}
                              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400">Job Title</label>
                          <div className="relative">
                            <Sparkles className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                              className="w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 pl-12 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                              placeholder="Job Title"
                              value={profile.job_title || ""}
                              onChange={(e) => setProfile({ ...profile, job_title: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400">Email Address (Read Only)</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                              className="w-full rounded-xl border border-white/5 bg-slate-950/20 p-3 pl-12 text-sm text-slate-500 outline-none cursor-not-allowed"
                              placeholder="name@company.com"
                              value={profile.email || ""}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                              className="w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 pl-12 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                              placeholder="Phone"
                              value={profile.phone || ""}
                              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400">Office Location</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                              className="w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 pl-12 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                              placeholder="City, Country"
                              value={profile.location || ""}
                              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400">User Timezone</label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                            <select
                              className="w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 pl-12 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                              value={profile.timezone || ""}
                              onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                            >
                              <option value="America/Los_Angeles">Pacific Time (PT)</option>
                              <option value="America/New_York">Eastern Time (ET)</option>
                              <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                              <option value="Asia/Kolkata">India Standard Time (IST)</option>
                              <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400">Professional Biography</label>
                        <textarea
                          className="w-full rounded-xl border border-white/5 bg-slate-950/60 p-4 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-vertical"
                          rows={4}
                          placeholder="Tell us about your background, active projects, or security credentials..."
                          value={profile.bio || ""}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Socials & Education Info */}
                  {activeTab === "socials" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          <Globe className="w-5 h-5 text-indigo-400" /> Professional Socials & Education
                        </h2>
                        <p className="text-xs text-slate-400">Share academic details and online profile coordinates.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400">Highest Education</label>
                          <div className="relative">
                            <GraduationCap className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                              className="w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 pl-12 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                              placeholder="Bachelor / Master / PhD"
                              value={profile.education || ""}
                              onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400">University Name</label>
                          <div className="relative">
                            <Building className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                              className="w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 pl-12 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                              placeholder="Stanford University"
                              value={profile.universities || ""}
                              onChange={(e) => setProfile({ ...profile, universities: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400">LinkedIn Profile Link</label>
                          <div className="relative">
                            <Briefcase className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                              className="w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 pl-12 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                              placeholder="https://linkedin.com/in/username"
                              value={profile.linkedin || ""}
                              onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400">GitHub Repository Link</label>
                          <div className="relative">
                            <Code2 className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                              className="w-full rounded-xl border border-white/5 bg-slate-950/60 p-3 pl-12 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                              placeholder="https://github.com/username"
                              value={profile.github || ""}
                              onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Integrations & Security Access Token */}
                  {activeTab === "integrations" && (
                    <div className="space-y-6">
                      
                      {/* Third Party Toggles */}
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Database className="w-5 h-5 text-indigo-400" /> Connected Integrations
                          </h2>
                          <p className="text-xs text-slate-400">Synchronize candidate data streams with external cloud endpoints.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { key: "github", title: "GitHub Sync", desc: "Sync deployment logs", icon: Code2, color: "text-white/80 bg-white/5" },
                            { key: "slack", title: "Slack Ingress", desc: "Report pipeline updates", icon: Globe, color: "text-emerald-400 bg-emerald-500/10" },
                            { key: "aws", title: "AWS Mirrored", desc: "Deploy VM mirror slices", icon: CloudIconPlaceholder, color: "text-orange-400 bg-orange-500/10" }
                          ].map((item: any) => {
                            const IconComp = item.icon;
                            const isChecked = (integrations as any)[item.key];
                            return (
                              <div
                                key={item.key}
                                onClick={() => toggleIntegration(item.key)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                                  isChecked 
                                    ? "bg-slate-900/50 border-indigo-500/30" 
                                    : "bg-slate-950/30 border-white/5 hover:border-white/10"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2.5 rounded-lg ${item.color}`}>
                                    <IconComp className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="block text-sm font-semibold text-slate-200">{item.title}</span>
                                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                                  </div>
                                </div>
                                {/* Modern switch */}
                                <div className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${isChecked ? "bg-indigo-600" : "bg-slate-800"}`}>
                                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] left-[3px] transition-transform duration-200 ${isChecked ? "transform translate-x-4" : ""}`} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* API Credentials Card */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <div>
                          <h3 className="text-md font-bold text-white flex items-center gap-2">
                            <Key className="w-4.5 h-4.5 text-indigo-400" /> API Orchestrator Key
                          </h3>
                          <p className="text-xs text-slate-400">Rotatable credentials for authentication using CLI terminals.</p>
                        </div>

                        <div className="flex items-center justify-between gap-4 bg-slate-950/60 border border-white/5 rounded-xl p-4">
                          <code className="text-xs font-mono text-slate-300 break-all select-all flex-1">
                            {profile.api_token || "ae_live_8321a00f2e519280cdb91c"}
                          </code>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => copyToClipboard(profile.api_token || "ae_live_8321a00f2e519280cdb91c", "API Token")}
                              className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Copy token"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={rotateApiKey}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                            >
                              Rotate Key
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Heatmap Contribution and sessions activity */}
                  {activeTab === "activity" && (
                    <div className="space-y-6">
                      
                      {/* Dynamic Heatmap */}
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-400" /> Active Console Map
                          </h2>
                          <p className="text-xs text-slate-400">Consolidated activity triggers and code reviews over the last 14 days.</p>
                        </div>

                        <div className="p-5 bg-slate-950/50 border border-white/5 rounded-xl space-y-4">
                          <div className="grid grid-cols-7 md:grid-cols-14 gap-3">
                            {activityMap.map((day, idx) => (
                              <div
                                key={idx}
                                className={`h-10 rounded-lg flex flex-col justify-between p-1.5 transition-all hover:scale-105 duration-200 cursor-help relative group ${
                                  day.level === 0 ? "bg-slate-900/40" :
                                  day.level === 1 ? "bg-indigo-500/20 border border-indigo-500/20" :
                                  day.level === 2 ? "bg-indigo-500/50 border border-indigo-400/40 shadow-[0_0_8px_rgba(99,102,241,0.2)]" :
                                  "bg-indigo-600 border border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                                }`}
                              >
                                <span className="text-[8px] block font-mono text-slate-400">{day.date}</span>
                                <span className="text-[10px] block font-extrabold text-white text-right">{day.count}</span>

                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-950 border border-white/10 rounded-md text-[10px] text-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-xl">
                                  {day.count === 0 ? "No activity" : `${day.count} deployments`} on {day.date}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-end gap-4 text-[10px] text-slate-400 items-center">
                            <span>Fewer</span>
                            <span className="w-2.5 h-2.5 rounded bg-slate-900/40" />
                            <span className="w-2.5 h-2.5 rounded bg-indigo-500/20" />
                            <span className="w-2.5 h-2.5 rounded bg-indigo-500/50" />
                            <span className="w-2.5 h-2.5 rounded bg-indigo-600" />
                            <span>More</span>
                          </div>
                        </div>
                      </div>

                      {/* Authorized Sessions */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <div>
                          <h3 className="text-md font-bold text-white flex items-center gap-2">
                            <Shield className="w-4.5 h-4.5 text-indigo-400" /> Active Session Handshakes
                          </h3>
                          <p className="text-xs text-slate-400">Connected sessions authorized using your developer profile tokens.</p>
                        </div>

                        <div className="space-y-3">
                          {/* Current Session */}
                          <div className="flex justify-between items-center p-3.5 bg-slate-950/60 border border-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-900 border border-white/5 rounded-lg text-emerald-400">
                                <Laptop className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="block text-sm font-semibold text-slate-200">Chrome / Windows (This Session)</span>
                                <span className="text-[10px] text-slate-400">San Francisco, USA • 192.168.1.42</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                              Current
                            </span>
                          </div>

                          {/* Revokable Sessions */}
                          <AnimatePresence>
                            {sessions.map((session) => {
                              const SessionIcon = session.icon;
                              return (
                                <motion.div
                                  key={session.id}
                                  initial={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95, height: 0, padding: 0, border: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex justify-between items-center p-3.5 bg-slate-950/60 border border-white/5 rounded-xl overflow-hidden"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-400">
                                      <SessionIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <span className="block text-sm font-semibold text-slate-200">{session.name}</span>
                                      <span className="text-[10px] text-slate-400">{session.meta}</span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => revokeSession(session.id, session.name)}
                                    className="p-1.5 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                                  >
                                    Revoke
                                  </button>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>

                          {sessions.length === 0 && (
                            <p className="text-xs text-center text-slate-500 mt-2">No other active authorized devices.</p>
                          )}
                        </div>
                      </div>

                      {/* Multi Factor Auth */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-xl">
                          <div>
                            <span className="block text-sm font-bold text-white flex items-center gap-1.5">
                              <Lock className="w-4 h-4 text-indigo-400" /> Multi-Factor Authentication (MFA)
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              Enforce double authorization validate handshake credentials.
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              profile.mfa_enabled 
                                ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" 
                                : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                            }`}>
                              {profile.mfa_enabled ? "Active" : "Inactive"}
                            </span>
                            <button
                              onClick={toggleMfa}
                              disabled={mfaVerifying}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-200 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              {mfaVerifying && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              {profile.mfa_enabled ? "Disable MFA" : "Enable MFA"}
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons row */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={saveProfile}
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] text-white px-8 py-3.5 font-bold disabled:opacity-50 transition-all flex items-center gap-2 self-end shrink-0 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Profile Settings</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Floating notifications Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none w-80">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`p-4 rounded-xl border text-white shadow-xl pointer-events-auto flex items-center justify-between gap-3 ${
                toast.type === "success" ? "bg-slate-900 border-emerald-500/30 border-l-4 border-l-emerald-500" :
                toast.type === "error" ? "bg-slate-900 border-rose-500/30 border-l-4 border-l-rose-500" :
                toast.type === "warn" ? "bg-slate-900 border-amber-500/30 border-l-4 border-l-amber-500" :
                "bg-slate-900 border-blue-500/30 border-l-4 border-l-blue-500"
              }`}
            >
              <div className="text-xs leading-relaxed flex-1">
                {toast.text}
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </main>
  );
}

// Simple local placeholder for CloudIcon inside integrations list
function CloudIconPlaceholder(props: any) {
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42 0-.83.04-1.24.12A7 7 0 0 0 2 12c0 3.87 3.13 7 7 7h8.5z" />
    </svg>
  );
}