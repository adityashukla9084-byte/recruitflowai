"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "../dashboard/components/sidebar";
import Header from "../dashboard/components/header";
import { Calendar, Trash2, ArrowRight, History, FileText, DollarSign } from "lucide-react";

type Analysis = {
  id: string;
  ats_score: number;
  job_match: number;
  salary_range: string;
  created_at: string;
};

function matchColor(score: number): string {
  if (score >= 80) return "var(--rf-match-high)";
  if (score >= 50) return "var(--rf-match-mid)";
  return "var(--rf-match-low)";
}

export default function HistoryPage() {
  const router = useRouter();

  const [history, setHistory] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("analysis_history")
      .select("id, ats_score, job_match, salary_range, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setHistory(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && active) {
        supabase
          .from("analysis_history")
          .select("id, ats_score, job_match, salary_range, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .then(({ data, error }) => {
            if (active) {
              if (!error && data) {
                setHistory(data);
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

  async function deleteAnalysis(id: string) {
    const ok = confirm("Delete this analysis history record?");
    if (!ok) return;

    await supabase
      .from("analysis_history")
      .delete()
      .eq("id", id);

    loadHistory();
  }

  return (
    <div className="flex min-h-screen bg-theme-bg text-theme-text">
      {/* Sidebar Navigation */}
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header navigation bar */}
        <Header />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-5xl mx-auto w-full relative z-10">
          
          {/* Page context / heading */}
          <div className="pb-4 border-b border-theme-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shadow-sm">
                <History size={10} className="animate-pulse" />
                <span style={{ fontFamily: "var(--font-geist-mono), monospace" }}>Report Archive</span>
              </div>
              <h1 className="text-3xl font-black uppercase text-theme-text tracking-tight">
                Analysis History
              </h1>
              <p className="text-xs text-theme-text-muted">
                Browse, search, and download your past resume evaluation reports.
              </p>
            </div>
            {history.length > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-theme-border/50 bg-theme-bg-secondary/40 text-theme-text-muted shrink-0 font-mono">
                {history.length} {history.length === 1 ? "Report" : "Reports"} Found
              </span>
            )}
          </div>

          {/* List display */}
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-44 w-full animate-pulse rounded-2xl bg-theme-card-hover border border-theme-border/20" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="border border-dashed border-theme-border/50 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4 bg-theme-bg-secondary/10 shadow-[var(--shadow-card)] max-w-lg mx-auto mt-8">
              <div className="w-12 h-12 rounded-xl border border-theme-border bg-theme-bg-secondary/40 flex items-center justify-center text-theme-text-muted">
                <FileText size={18} strokeWidth={1.5} />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-theme-text">No reports archive found</p>
                <p className="text-xs text-theme-text-muted leading-relaxed max-w-xs">
                  Run a candidate compatibility evaluation on the main dashboard to store reports.
                </p>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-theme-text text-theme-bg px-4 py-2 text-xs font-semibold hover:opacity-90 shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                Go to Dashboard
                <ArrowRight size={12} />
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {history.map((item) => {
                const scoreColor = matchColor(item.ats_score);
                return (
                  <div
                    key={item.id}
                    className="bg-theme-card border border-theme-border/50 hover:border-theme-accent/30 rounded-2xl p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 relative overflow-hidden group flex flex-col justify-between min-h-[170px]"
                  >
                    {/* Left border indicator accent */}
                    <span
                      className="absolute left-0 top-0 bottom-0 w-[3px]"
                      style={{ backgroundColor: scoreColor }}
                    />

                    <div>
                      {/* Top bar info */}
                      <div className="flex items-center justify-between mb-3 text-[10px] text-theme-text-muted font-mono select-none">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => deleteAnalysis(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-theme-text-muted hover:text-red-500 p-1 rounded hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {/* Main metrics display */}
                      <div className="flex items-baseline justify-between mb-4">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-theme-text-muted select-none">
                            ATS Score
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span
                              className="text-3xl font-black tracking-tight"
                              style={{
                                color: scoreColor,
                                fontFamily: "var(--font-geist-mono), monospace",
                              }}
                            >
                              {item.ats_score}
                            </span>
                            <span className="text-xs text-theme-text-muted font-semibold">%</span>
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="text-[10px] font-semibold text-theme-text px-2 py-0.5 rounded border border-theme-border/60 bg-theme-bg-secondary/40 inline-block font-mono">
                            Match: {item.job_match}%
                          </div>
                          {item.salary_range && item.salary_range !== "—" && (
                            <p className="text-[9px] text-theme-text-muted flex items-center gap-0.5 justify-end font-mono">
                              <DollarSign size={10} />
                              {item.salary_range}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* View report CTA */}
                    <button
                      onClick={() => router.push(`/history/${item.id}`)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2 px-4 text-xs font-bold transition-all duration-200 bg-theme-bg-secondary/40 hover:bg-theme-bg-secondary/70 border border-theme-border/50 text-theme-text cursor-pointer hover:shadow-sm"
                    >
                      View Report
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}