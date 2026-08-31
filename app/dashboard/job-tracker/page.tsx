"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Briefcase, Building2, Sparkles, Clock, ArrowRightLeft, CheckCircle2 } from "lucide-react";

type Job = {
  id: number;
  company: string;
  role: string;
  status: string;
  created_at: string;
};

const columnStatuses = ["Applied", "Interview", "Offer", "Rejected"];

export default function JobTracker() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [loading, setLoading] = useState(false);

  async function loadJobs() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("job_tracker")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setJobs(data || []);
  }

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && active) {
        supabase
          .from("job_tracker")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .then(({ data }) => {
            if (active) {
              setJobs(data || []);
            }
          });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  async function addJob() {
    if (!company.trim() || !role.trim()) {
      alert("Please enter both Company and Role.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setLoading(true);

    try {
      await supabase.from("job_tracker").insert({
        user_id: user.id,
        company: company.trim(),
        role: role.trim(),
        status,
      });

      setCompany("");
      setRole("");
      setStatus("Applied");

      await loadJobs();
    } catch (err) {
      console.error("Failed to add application:", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateJobStatus(id: number, newStatus: string) {
    try {
      await supabase
        .from("job_tracker")
        .update({ status: newStatus })
        .eq("id", id);
      
      await loadJobs();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  async function deleteJob(id: number) {
    if (confirm("Are you sure you want to delete this job application?")) {
      try {
        await supabase
          .from("job_tracker")
          .delete()
          .eq("id", id);
        
        await loadJobs();
      } catch (err) {
        console.error("Failed to delete application:", err);
      }
    }
  }

  // Filter jobs by status
  const getJobsByStatus = (statusName: string) => {
    return jobs.filter(
      (job) => job.status.toLowerCase() === statusName.toLowerCase()
    );
  };

  // Color mappings for columns and cards
  const getStatusColor = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case "applied":
        return {
          glow: "bg-[#C5A028]",
          text: "text-[#D4AF37]",
          border: "border-[#C5A028]/20",
          pill: "bg-[#C5A028]/10 border-[#C5A028]/25 text-[#D4AF37]",
        };
      case "interview":
        return {
          glow: "bg-[#C5A028]",
          text: "text-[#D4AF37]",
          border: "border-[#C5A028]/20",
          pill: "bg-[#C5A028]/10 border-[#C5A028]/25 text-[#D4AF37]",
        };
      case "offer":
        return {
          glow: "bg-emerald-500",
          text: "text-emerald-400",
          border: "border-emerald-500/20",
          pill: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
        };
      case "rejected":
        return {
          glow: "bg-rose-500",
          text: "text-rose-400",
          border: "border-rose-500/20",
          pill: "bg-rose-500/10 border-rose-500/25 text-rose-400",
        };
      default:
        return {
          glow: "bg-slate-500",
          text: "text-theme-text",
          border: "border-slate-500/20",
          pill: "bg-slate-500/10 border-slate-500/25 text-theme-text",
        };
    }
  };

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text p-6 md:p-12 relative overflow-hidden flex justify-center items-start">
      {/* Decorative blurred background blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#C5A028]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#C5A028]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl w-full space-y-10 relative z-10 animate-[fadeIn_0.5s]">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A028]/10 border border-[#C5A028]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Active Pipeline Tracking</span>
          </div>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-[#FFFFF0]">
              Application Tracker
            </h1>
            <p className="text-sm text-theme-text-secondary mt-1.5 font-medium leading-relaxed max-w-2xl">
              Track your pending job applications, interview timelines, and offer letters. Update and advance statuses instantly on your pipeline board.
            </p>
          </div>
        </div>

        {/* Add Application Form Panel */}
        <div className="rounded-3xl border border-theme-border bg-theme-card/30  p-6 shadow-2xl space-y-4">
          <h2 className="text-xs font-bold text-theme-text flex items-center gap-2 uppercase tracking-widest border-b border-zinc-900/60 pb-3 mb-1">
            <Plus className="h-4 w-4 text-[#D4AF37]" />
            <span>Track New Application</span>
          </h2>

          <div className="grid gap-4 md:grid-cols-4">
            
            {/* Company Name */}
            <div className="flex items-center rounded-xl bg-theme-bg-secondary/60 border border-zinc-900 px-4 focus-within:border-[#C5A028]/30 transition">
              <Building2 className="text-zinc-300 h-4.5 w-4.5 mr-2 shrink-0" />
              <input
                placeholder="Company (e.g. Google)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-transparent py-4 text-sm text-[#FFFFF0] placeholder-slate-500 outline-none"
              />
            </div>

            {/* Role Title */}
            <div className="flex items-center rounded-xl bg-theme-bg-secondary/60 border border-zinc-900 px-4 focus-within:border-[#C5A028]/30 transition">
              <Briefcase className="text-zinc-300 h-4.5 w-4.5 mr-2 shrink-0" />
              <input
                placeholder="Role (e.g. Lead Designer)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-transparent py-4 text-sm text-[#FFFFF0] placeholder-slate-500 outline-none"
              />
            </div>

            {/* Status Select */}
            <div className="flex items-center rounded-xl bg-theme-bg-secondary/60 border border-zinc-900 px-4 focus-within:border-[#C5A028]/30 transition">
              <Clock className="text-zinc-300 h-4.5 w-4.5 mr-2 shrink-0" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-transparent py-4 text-sm text-[#FFFFF0] placeholder-slate-500 outline-none select-custom"
              >
                {columnStatuses.map((opt) => (
                  <option key={opt} className="bg-zinc-950 text-[#FFFFF0]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Button */}
            <button
              onClick={addJob}
              disabled={loading}
              className="rounded-xl bg-[#C5A028] hover:bg-[#B89020] disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold py-4 text-sm transition shadow-lg shadow-[#] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus size={16} />
              <span>Track Application</span>
            </button>
          </div>
        </div>

        {/* Kanban Board Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          
          {columnStatuses.map((colStatus) => {
            const list = getJobsByStatus(colStatus);
            const style = getStatusColor(colStatus);

            return (
              <div
                key={colStatus}
                className="flex flex-col rounded-2xl border border-theme-border bg-zinc-950/30  p-4 space-y-4 shadow-xl min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${style.glow} shadow-[0_0_8px_currentColor]`} />
                    <h3 className="text-sm font-black text-[#FFFFF0] uppercase tracking-wider">
                      {colStatus}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-theme-text bg-zinc-950 border border-zinc-900 px-2 py-0.5 rounded-full">
                    {list.length}
                  </span>
                </div>

                {/* Card List Stack */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-custom">
                  {list.length > 0 ? (
                    list.map((job) => (
                      <div
                        key={job.id}
                        className="rounded-xl border border-theme-border bg-theme-card/30 p-4.5 space-y-4 shadow-[var(--shadow-card)] hover:border-[#C5A028]/20 hover:scale-[1.01] transition-all duration-300 relative group"
                      >
                        <div className="space-y-1">
                          <h4 className="text-base font-bold text-[#FFFFF0] group-hover:text-[#D4AF37] transition leading-snug">
                            {job.company}
                          </h4>
                          <p className="text-xs text-theme-text-secondary font-medium">
                            {job.role}
                          </p>
                        </div>

                        {/* Card controls (Status change dropdown & delete button) */}
                        <div className="pt-3 border-t border-zinc-900/60 flex items-center justify-between gap-2.5">
                          
                          {/* Quick status dropdown */}
                          <div className="flex items-center gap-1 text-xs text-zinc-300 font-bold uppercase tracking-wider relative">
                            <ArrowRightLeft size={10} className="text-zinc-300 shrink-0" />
                            <select
                              value={job.status}
                              onChange={(e) =>
                                updateJobStatus(job.id, e.target.value)
                              }
                              className="bg-transparent border-none text-xs text-theme-text font-bold focus:outline-none cursor-pointer uppercase tracking-wider hover:text-[#FFFFF0] transition"
                              title="Update Status"
                            >
                              {columnStatuses.map((opt) => (
                                <option
                                  key={opt}
                                  value={opt}
                                  className="bg-zinc-950 text-[#FFFFF0] text-xs uppercase"
                                >
                                  Move to {opt}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Delete Action button */}
                          <button
                            onClick={() => deleteJob(job.id)}
                            className="p-1 rounded bg-zinc-950/40 border border-zinc-900 text-zinc-300 hover:text-red-400 hover:border-red-500/20 transition cursor-pointer"
                            title="Remove Application"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-40 border border-dashed border-zinc-900 rounded-xl flex items-center justify-center text-center p-4">
                      <p className="text-xs text-zinc-300 font-bold uppercase tracking-wider leading-relaxed">
                        No Applications in Pipeline
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
