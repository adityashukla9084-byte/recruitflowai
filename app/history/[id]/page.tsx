"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Sidebar from "../../dashboard/components/sidebar";
import Header from "../../dashboard/components/header";
import type { AnalysisResult } from "@/app/dashboard/types";
import {
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
  ListX,
  FileText,
  Mic,
  TrendingUp,
  DollarSign,
} from "lucide-react";

function matchColor(score: number): string {
  if (score >= 80) return "var(--rf-match-high)";
  if (score >= 50) return "var(--rf-match-mid)";
  return "var(--rf-match-low)";
}

export default function ReportPage() {
  const { id } = useParams();
  const router = useRouter();

  const [report, setReport] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from("analysis_history")
      .select("result")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (active) {
          if (!error && data) {
            setReport(data.result as unknown as AnalysisResult);
          }
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  const copyCoverLetter = () => {
    if (report?.coverLetter) {
      navigator.clipboard.writeText(report.coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-theme-bg text-theme-text">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 sm:p-8 flex items-center justify-center">
            <div className="text-sm font-semibold text-theme-text-muted animate-pulse">Loading report...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-screen bg-theme-bg text-theme-text">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col items-center justify-center space-y-4">
            <div className="text-sm font-semibold text-theme-text-muted">Report not found.</div>
            <button
              onClick={() => router.push("/history")}
              className="rounded-xl bg-theme-text text-theme-bg px-4 py-2 text-xs font-semibold hover:opacity-90 transition-all duration-200"
            >
              Back to History
            </button>
          </main>
        </div>
      </div>
    );
  }

  const atsScore = report.atsScore ?? 0;
  const scoreColor = matchColor(atsScore);

  return (
    <div className="flex min-h-screen bg-theme-bg text-theme-text">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-4xl mx-auto w-full relative z-10">
          {/* Breadcrumbs */}
          <div className="select-none">
            <Link
              href="/history"
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-theme-text-muted hover:text-theme-text transition-colors duration-200"
            >
              <ArrowLeft size={11} />
              Back to History
            </Link>
          </div>

          {/* Heading */}
          <div className="pb-4 border-b border-theme-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shadow-sm">
                <FileText size={10} className="animate-pulse" />
                <span style={{ fontFamily: "var(--font-geist-mono), monospace" }}>Report Details</span>
              </div>
              <h1 className="text-3xl font-black uppercase text-theme-text tracking-tight">
                Evaluation Report
              </h1>
              <p className="text-xs text-theme-text-muted">
                Review scores, analysis feedback, and AI generated interview preparations.
              </p>
            </div>
          </div>

          {/* Metrics summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {/* ATS Score */}
            <div className="bg-theme-card border border-theme-border/50 rounded-2xl p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 relative overflow-hidden group">
              <span className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: scoreColor }} />
              <span className="text-[8px] font-bold uppercase tracking-widest text-theme-text-muted block mb-1 select-none">
                ATS Score
              </span>
              <div className="flex items-baseline gap-0.5">
                <span
                  className="text-2xl font-black tracking-tight"
                  style={{ color: scoreColor, fontFamily: "var(--font-geist-mono), monospace" }}
                >
                  {atsScore}
                </span>
                <span className="text-[10px] text-theme-text-muted font-bold">%</span>
              </div>
            </div>

            {/* Job Match */}
            <div className="bg-theme-card border border-theme-border/50 rounded-2xl p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 relative overflow-hidden group">
              <span className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: matchColor(report.jobMatchScore ?? 0) }} />
              <span className="text-[8px] font-bold uppercase tracking-widest text-theme-text-muted block mb-1 select-none">
                Job Match
              </span>
              <div className="flex items-baseline gap-0.5">
                <span
                  className="text-2xl font-black tracking-tight"
                  style={{ color: matchColor(report.jobMatchScore ?? 0), fontFamily: "var(--font-geist-mono), monospace" }}
                >
                  {report.jobMatchScore ?? 0}
                </span>
                <span className="text-[10px] text-theme-text-muted font-bold">%</span>
              </div>
            </div>

            {/* Salary Estimate */}
            <div className="bg-theme-card border border-theme-border/50 rounded-2xl p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 relative overflow-hidden group">
              <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-sky-500" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-theme-text-muted block mb-1 select-none">
                Est. Salary
              </span>
              <div className="flex items-baseline gap-0.5 min-w-0">
                <DollarSign size={12} className="text-sky-500 shrink-0 self-center" />
                <span className="text-xs sm:text-sm font-bold text-theme-text truncate font-mono">
                  {report.salaryRange && report.salaryRange !== "—" ? report.salaryRange : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-theme-card border border-theme-border/50 rounded-2xl p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2 mb-3 select-none">
                <Sparkles size={14} className="text-sky-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text">Executive Summary</h3>
              </div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">
                {report.summary}
              </p>
            </div>

            {/* Recruiter Feedback */}
            <div className="bg-theme-card border border-theme-border/50 rounded-2xl p-5 shadow-[var(--shadow-card)] relative overflow-hidden group">
              <div className="flex items-center gap-2 mb-3 select-none">
                <MessageSquare size={14} className="text-sky-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text">Recruiter Feedback</h3>
              </div>
              <p className="text-xs text-theme-text-secondary leading-relaxed">
                {report.recruiterFeedback}
              </p>
            </div>

            {/* Missing Keywords Tag Cloud */}
            <div className="bg-theme-card border border-theme-border/50 rounded-2xl p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2 mb-3 select-none">
                <ListX size={14} className="text-red-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text">Missing Critical Keywords</h3>
              </div>
              {report.missingKeywords && report.missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {report.missingKeywords.map((item: string) => (
                    <span
                      key={item}
                      className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 select-all"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-theme-text-muted">No missing critical keywords detected!</p>
              )}
            </div>

            {/* Cover Letter Box */}
            <div className="bg-theme-card border border-theme-border/50 rounded-2xl p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between mb-3 select-none">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-sky-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text">Custom Cover Letter</h3>
                </div>
                {report.coverLetter && (
                  <button
                    onClick={copyCoverLetter}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-theme-text-muted hover:text-sky-500 transition-colors duration-200 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={11} className="text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        Copy Text
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="rounded-xl border border-theme-border/40 p-4 bg-theme-bg-secondary/20 max-h-[300px] overflow-y-auto">
                <pre className="text-xs text-theme-text-secondary font-mono leading-relaxed whitespace-pre-wrap select-all">
                  {report.coverLetter || "No custom cover letter generated."}
                </pre>
              </div>
            </div>

            {/* Interview Prep Questions */}
            <div className="bg-theme-card border border-theme-border/50 rounded-2xl p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2 mb-4 select-none">
                <Mic size={14} className="text-sky-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text">Interview Preparation Questions</h3>
              </div>
              {report.interviewQuestions && report.interviewQuestions.length > 0 ? (
                <div className="space-y-2.5">
                  {report.interviewQuestions.map((q: string, index: number) => (
                    <div
                      key={index}
                      className="flex gap-3 p-3 bg-theme-bg-secondary/15 border border-theme-border/40 rounded-xl hover:border-sky-500/20 transition-colors duration-200 select-text"
                    >
                      <span className="w-5 h-5 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-[10px] font-bold text-sky-500 shrink-0 font-mono select-none">
                        {index + 1}
                      </span>
                      <p className="text-xs text-theme-text-secondary leading-relaxed font-medium">
                        {q}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-theme-text-muted">No preparation questions available.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}