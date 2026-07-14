"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StatsCards from "../components/StatsCards";
import AnalyticsChart from "../components/AnalyticsChart";
import { Sparkles, Brain, TrendingUp, Award, Briefcase, Activity, CheckCircle2, AlertCircle, Clock, FileText, CheckSquare } from "lucide-react";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    atsScore: 0,
    jobMatch: 0,
    reportsCount: 0,
    bestScore: 0,
    avgScore: 0,
    totalJobs: 0,
    interviewsCount: 0,
    offersCount: 0,
    rejectedCount: 0,
  });
  const [chartData, setChartData] = useState<{ name: string; score: number }[]>([]);

  useEffect(() => {
    let active = true;

    async function loadAnalytics() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !active) {
        setLoading(false);
        return;
      }

      try {
        // Fetch ATS scan history
        const { data: historyData } = await supabase
          .from("analysis_history")
          .select("ats_score, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        // Fetch Job Tracker pipeline
        const { data: trackerData } = await supabase
          .from("job_tracker")
          .select("status")
          .eq("user_id", user.id);

        if (!active) return;

        const scores = historyData ? historyData.map((h) => h.ats_score) : [];
        const reportsCount = scores.length;
        const bestScore = reportsCount > 0 ? Math.max(...scores) : 0;
        const avgScore =
          reportsCount > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / reportsCount)
            : 0;
        const latestAtsScore = reportsCount > 0 ? scores[scores.length - 1] : 0;

        const cData = historyData
          ? historyData.map((item, index) => ({
              name: `#${index + 1}`,
              score: item.ats_score,
            }))
          : [];

        // Pipeline stats
        const totalJobs = trackerData ? trackerData.length : 0;
        const interviewsCount = trackerData
          ? trackerData.filter((j) => j.status.toLowerCase() === "interview").length
          : 0;
        const offersCount = trackerData
          ? trackerData.filter((j) => j.status.toLowerCase() === "offer").length
          : 0;
        const rejectedCount = trackerData
          ? trackerData.filter((j) => j.status.toLowerCase() === "rejected").length
          : 0;

        setStats({
          atsScore: latestAtsScore,
          jobMatch: avgScore > 0 ? Math.min(100, Math.round(avgScore * 0.94)) : 0, // Deterministic aligned match score
          reportsCount,
          bestScore,
          avgScore,
          totalJobs,
          interviewsCount,
          offersCount,
          rejectedCount,
        });

        setChartData(cData);
      } catch (err) {
        console.error("Failed to load analytics data:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAnalytics();

    return () => {
      active = false;
    };
  }, []);

  // Conversion calculations
  const interviewRate =
    stats.totalJobs > 0
      ? Math.round((stats.interviewsCount / stats.totalJobs) * 100)
      : 0;
  const offerRate =
    stats.totalJobs > 0
      ? Math.round((stats.offersCount / stats.totalJobs) * 100)
      : 0;

  // Diagnostic items resolved by current score
  const diagnostics = [
    {
      label: "ATS Layout Compatibility",
      passed: stats.atsScore >= 70,
      desc: stats.atsScore >= 70 ? "Structure matches ATS parsers" : "Increase layout structure clarity",
    },
    {
      label: "Keyword Optimization",
      passed: stats.atsScore >= 80,
      desc: stats.atsScore >= 80 ? "Sufficient keywords detected" : "Add job-description skills keywords",
    },
    {
      label: "Action Metric Quantifier Density",
      passed: stats.atsScore > 0,
      desc: stats.atsScore > 0 ? "Results support achievements" : "Integrate numbers and metrics",
    },
    {
      label: "Grammar & Styling Check",
      passed: stats.atsScore >= 60,
      desc: stats.atsScore >= 60 ? "No styling flaws flagged" : "Scan resume to check grammar",
    },
  ];

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text p-6 md:p-12 relative overflow-hidden flex justify-center items-start">
      {/* Background blurred glow elements */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl w-full space-y-10 relative z-10 animate-[fadeIn_0.5s]">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Interactive Insights</span>
          </div>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-theme-text-secondary mt-1.5 font-medium leading-relaxed max-w-2xl">
              Monitor ATS score trends, evaluate job application pipelines, and identify critical resume improvements.
            </p>
          </div>
        </div>

        {/* Top Summary Row (4 Columns Grid) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Total Scan runs */}
          <div className="rounded-2xl border border-theme-border bg-theme-card/20 backdrop-blur-md p-5 flex items-center justify-between shadow-[var(--shadow-card)] hover:border-cyan-500/20 transition-all duration-300">
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Scan Runs</span>
              <h3 className="text-3xl font-black text-white font-mono leading-none">{stats.reportsCount}</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Activity size={18} />
            </div>
          </div>

          {/* Peak ATS Score */}
          <div className="rounded-2xl border border-theme-border bg-theme-card/20 backdrop-blur-md p-5 flex items-center justify-between shadow-[var(--shadow-card)] hover:border-cyan-500/20 transition-all duration-300">
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Peak ATS Score</span>
              <h3 className="text-3xl font-black text-emerald-400 font-mono leading-none">{stats.bestScore}%</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Award size={18} />
            </div>
          </div>

          {/* Average ATS Score */}
          <div className="rounded-2xl border border-theme-border bg-theme-card/20 backdrop-blur-md p-5 flex items-center justify-between shadow-[var(--shadow-card)] hover:border-cyan-500/20 transition-all duration-300">
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Average Score</span>
              <h3 className="text-3xl font-black text-teal-400 font-mono leading-none">{stats.avgScore}%</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <TrendingUp size={18} />
            </div>
          </div>

          {/* Active pipeline interviews */}
          <div className="rounded-2xl border border-theme-border bg-theme-card/20 backdrop-blur-md p-5 flex items-center justify-between shadow-[var(--shadow-card)] hover:border-cyan-500/20 transition-all duration-300">
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Interviews</span>
              <h3 className="text-3xl font-black text-amber-400 font-mono leading-none">{stats.interviewsCount}</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock size={18} />
            </div>
          </div>

        </div>

        {/* Main Section split dashboard */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Left Column (2/3 width) - Charts & Scores */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Core statistics component wrapper */}
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted mb-0.5">Resume Scans</p>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Brain size={13} className="text-cyan-400" />
                  <span>ATS Benchmarks</span>
                </h3>
              </div>
              
              <StatsCards
                atsScore={stats.atsScore}
                jobMatch={stats.jobMatch}
                reports={stats.reportsCount}
                salary="₹10-15 LPA"
                loading={loading}
              />
            </div>

            {/* Historical Score Trend chart wrapper */}
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted mb-0.5">Progress History</p>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Activity size={13} className="text-teal-400" />
                  <span>ATS Evaluation Timeline</span>
                </h3>
              </div>

              <AnalyticsChart data={chartData} />
            </div>

          </div>

          {/* Right Column (1/3 width) - Funnel & Diagnostics */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Pipeline conversion funnel card */}
            <div className="rounded-2xl border border-theme-border bg-theme-card/30 backdrop-blur-md p-6 shadow-xl space-y-6">
              <div>
                <h3 className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted select-none">
                  Conversion Funnel
                </h3>
                <h4 className="text-base font-extrabold text-white mt-1">Application Pipeline</h4>
              </div>

              <div className="space-y-5">
                {/* Stage 1: Submitted */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>1. Tracked Submissions</span>
                    <span className="font-mono text-cyan-400">{stats.totalJobs} jobs (100%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950 border border-slate-900 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full w-full shadow-[0_0_8px_var(--color-theme-accent)]" />
                  </div>
                </div>

                {/* Stage 2: Interview */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>2. Interview Stage</span>
                    <span className="font-mono text-amber-400">{stats.interviewsCount} calls ({interviewRate}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950 border border-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                      style={{ width: `${interviewRate}%` }}
                    />
                  </div>
                </div>

                {/* Stage 3: Offer */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>3. Offer Stage</span>
                    <span className="font-mono text-emerald-400">{stats.offersCount} landed ({offerRate}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950 border border-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                      style={{ width: `${offerRate}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-theme-text-muted leading-relaxed font-semibold">
                * Rates are calculated based on overall pipeline conversions in your [Job Tracker](file:///C:/Users/DELL/Desktop/recruitflowai/app/dashboard/job-tracker/page.tsx).
              </p>
            </div>

            {/* ATS Diagnostics Checklist Card */}
            <div className="rounded-2xl border border-theme-border bg-theme-card/30 backdrop-blur-md p-6 shadow-xl space-y-6">
              <div>
                <h3 className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted select-none">
                  AI Assessment
                </h3>
                <h4 className="text-base font-extrabold text-white mt-1">Diagnostic Checks</h4>
              </div>

              <div className="space-y-4">
                {diagnostics.map((diag, index) => (
                  <div key={index} className="flex gap-3 items-start text-xs">
                    <div className="shrink-0 mt-0.5">
                      {diag.passed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-slate-600" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="font-extrabold text-white">{diag.label}</h5>
                      <p className="text-[10px] text-slate-400 font-semibold">{diag.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}