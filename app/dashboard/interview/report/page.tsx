"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle, ArrowRight, Award, RefreshCw, BarChart2, CheckSquare, Sparkles, BookOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Report = {
  job_role: string;
  score: number;
  feedback: string;
  improvement: string;
  created_at: string;
};

export default function InterviewReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && active) {
        supabase
          .from("interview_history")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()
          .then(({ data, error }) => {
            if (active) {
              if (!error && data) {
                setReport(data);
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

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-[#FFFFF0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-[#C5A028]/30 border--[#C5A028] rounded-full animate-spin" />
          <span className="font-bold text-sm tracking-wider uppercase text-[#D4AF37] animate-pulse">Retrieving Report...</span>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen bg-zinc-950 text-[#FFFFF0] flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <AlertTriangle className="h-12 w-12 text-[#D4AF37] mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold">No Interview History Found</h2>
          <p className="text-sm text-theme-text leading-relaxed">
            We couldn't find any recent interview records on your profile. Please complete an interview session first to unlock your feedback report card.
          </p>
          <button
            onClick={() => router.push("/dashboard/interview")}
            className="mt-2 rounded-xl bg-[#C5A028] hover:bg-[#B89020] text-slate-950 px-6 py-3 font-bold transition shadow-lg shadow-[#] cursor-pointer text-sm"
          >
            Start Mock Interview
          </button>
        </div>
      </main>
    );
  }

  // Parse improvement points for the interactive checklist
  const improvementItems = report.improvement
    ? report.improvement.split("\n")
        .map(line => line.trim().replace(/^[-•*✔▪●]\s*/, "").replace(/^\d+[.)]?\s*/, "").trim())
        .filter(Boolean)
    : [];

  // Determine score status levels
  const getScoreDetails = (score: number) => {
    if (score >= 80) return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Excellent Performance" };
    if (score >= 60) return { color: "text-[#D4AF37]", bg: "bg-[#C5A028]/10", border: "border-[#C5A028]/20", label: "Meeting Expectations" };
    return { color: "text-[#D4AF37]", bg: "bg-[#C5A028]/10", border: "border-[#C5A028]/20", label: "Needs Focused Preparation" };
  };

  const scoreDetails = getScoreDetails(report.score);
  const formattedDate = new Date(report.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  // Circle SVG Dash Math
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (report.score / 100) * circumference;

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text p-4 md:p-12 relative overflow-hidden flex items-center justify-center">
      
      {/* Decorative blurred background blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A028]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#C5A028]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl w-full space-y-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border/60 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A028]/10 border border-[#C5A028]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>Assessment Completed</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#FFFFF0] leading-none mt-2">
              Performance Scorecard
            </h1>
            <p className="text-xs text-theme-text-secondary font-semibold uppercase tracking-widest mt-1">
              Evaluated on {formattedDate}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard/interview")}
              className="rounded-xl border border-theme-border hover:border-[#C5A028]/40 px-5 py-3 font-bold text-sm text-zinc-300 hover:text-[#FFFFF0] transition flex items-center gap-2 cursor-pointer bg-zinc-950/20 "
            >
              <RefreshCw size={14} />
              <span>Retake Session</span>
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-xl bg-[#C5A028] hover:bg-[#B89020] text-slate-950 px-5 py-3 font-bold text-sm transition flex items-center gap-2 cursor-pointer shadow-lg shadow-[#]"
            >
              <span>Dashboard</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Analytics Highlights Row */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Circular Score Gauge Card */}
          <div className="rounded-2xl border border-theme-border bg-theme-card/30  p-6 flex flex-col items-center justify-center space-y-4 shadow-xl text-center">
            <div className="relative flex items-center justify-center">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r={normalizedRadius}
                  className="stroke-slate-800"
                  strokeWidth={stroke}
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={normalizedRadius}
                  className="-[#C5A028] transition-all duration-1000 ease-out"
                  strokeWidth={stroke}
                  fill="transparent"
                  strokeDasharray={circumference + " " + circumference}
                  style={{ strokeDashoffset }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-[#FFFFF0] leading-none">{report.score}</span>
                <span className="text-xs text-theme-text font-bold uppercase tracking-wider mt-1">out of 100</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <span className={`text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${scoreDetails.bg} ${scoreDetails.border} ${scoreDetails.color}`}>
                {scoreDetails.label}
              </span>
            </div>
          </div>

          {/* Job Target Card */}
          <div className="md:col-span-2 rounded-2xl border border-theme-border bg-theme-card/30  p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#C5A028]/5 rounded-full blur-2xl group-hover:bg-[#C5A028]/10 transition duration-500" />
            <div className="space-y-4 relative z-10">
              <div className="inline-flex p-2.5 rounded-xl bg-[#C5A028]/10 text-[#D4AF37]">
                <Award className="h-5.5 w-5.5" />
              </div>
              <div>
                <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-widest">Job Classification</span>
                <h3 className="text-2xl font-black tracking-tight text-[#FFFFF0] mt-1 leading-snug">{report.job_role}</h3>
              </div>
            </div>
            
            <div className="pt-4 border-t border-theme-border/60 flex items-center justify-between text-xs text-theme-text-secondary font-medium mt-4">
              <span>Evaluation Criteria</span>
              <span className="text-[#D4AF37] font-bold">Standard AI-Rubric v2</span>
            </div>
          </div>

        </div>

        {/* AI Feedback & Improvement Plan Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Detailed Feedback Card */}
          <div className="rounded-2xl border border-theme-border bg-theme-card/25  p-6 md:p-8 space-y-5 shadow-xl">
            <h3 className="text-lg font-black tracking-tight text-[#FFFFF0] flex items-center gap-2 border-b border-theme-border/60 pb-3">
              <BarChart2 className="h-5 w-5 text-[#D4AF37]" />
              <span>AI Evaluation Critique</span>
            </h3>
            <p className="text-sm text-theme-text-secondary leading-relaxed font-medium whitespace-pre-wrap">
              {report.feedback}
            </p>
          </div>

          {/* Improvement Checklist Card */}
          <div className="rounded-2xl border border-theme-border bg-theme-card/25  p-6 md:p-8 space-y-5 shadow-xl flex flex-col">
            <h3 className="text-lg font-black tracking-tight text-[#FFFFF0] flex items-center gap-2 border-b border-theme-border/60 pb-3">
              <BookOpen className="h-5 w-5 text-[#D4AF37]" />
              <span>Personalized Action Plan</span>
            </h3>

            {improvementItems.length > 0 ? (
              <div className="space-y-4 flex-1">
                {improvementItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 group">
                    <div className="mt-0.5 rounded bg-theme-bg-secondary border border-zinc-800 h-4.5 w-4.5 shrink-0 flex items-center justify-center group-hover:border-[#C5A028]/40 transition">
                      <CheckCircle className="h-3 w-3 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-theme-text-secondary font-medium leading-relaxed group-hover:text-theme-text transition">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-theme-text-secondary leading-relaxed font-medium whitespace-pre-wrap">
                {report.improvement}
              </p>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
