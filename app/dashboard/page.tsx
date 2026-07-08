"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { AnalysisResult } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Check, 
  Copy, 
  X, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Award,
  AlertCircle
} from "lucide-react";

import ProgressCard from "./components/ProgressCard";
import FeedbackCard from "./components/FeedbackCard";
import KeywordCard from "./components/KeywordCard";
import InterviewCard from "./components/InterviewCard";
import ResumeRewriteCard from "./components/ResumeRewriteCard";
import JobMatchCard from "./components/JobMatchCard";
import SalaryCard from "./components/SalaryCard";
import CoverLetterCard from "./components/CoverLetterCard";
import DownloadReportButton from "./components/DownloadReportButton";
import StatsCards from "./components/StatsCards";
import Header from "./components/header";
import Hero from "./components/hero";
import ScoreGauge from "./components/ScoreGauge";
import QuickActions from "./components/QuickActions";
import AnalyticsChart from "./components/AnalyticsChart";

export default function Dashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportsCount, setReportsCount] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [chartData, setChartData] = useState<{ name: string; score: number }[]>([]);

  // Drag and drop states
  const [dragActive, setDragActive] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "enhancements" | "coach">("overview");

  // Copy feedbacks
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && active) {
        supabase
          .from("analysis_history")
          .select("ats_score, created_at", { count: "exact" })
          .eq("user_id", user.id)
          .order("created_at", { ascending: true })
          .then(({ data, count }) => {
            if (active) {
              setReportsCount(count ?? 0);
              if (data) {
                setChartData(
                  data.map((item, index) => ({
                    name: `#${index + 1}`,
                    score: item.ats_score,
                  }))
                );
              }
            }
          });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const ext = droppedFile.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf" || ext === "docx") {
        setFile(droppedFile);
        setResult(null);
      } else {
        alert("Please select a PDF or DOCX file.");
      }
    }
  };

  const selectFiles = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
  };

  async function handleAnalyze() {
    if (!file) {
      alert("Please select a resume.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);

      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        alert(data.error ?? "Analysis Failed");
        return;
      }

      setResult(data.result);
      // Fetch updated history
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: historyData, count } = await supabase
          .from("analysis_history")
          .select("ats_score, created_at", { count: "exact" })
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        setReportsCount(count ?? 0);
        if (historyData) {
          setChartData(
            historyData.map((item, index) => ({
              name: `#${index + 1}`,
              score: item.ats_score,
            }))
          );
        }
      }
    } catch (err) {
      console.error(err);
      alert("Analysis Failed");
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = (text: string, type: "summary" | "letter") => {
    navigator.clipboard.writeText(text);
    if (type === "summary") {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } else {
      setCopiedCoverLetter(true);
      setTimeout(() => setCopiedCoverLetter(false), 2000);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-[var(--bg-gradient-from)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-to)] text-theme-text pb-16">
      <Header />

      <div className="mx-auto max-w-7xl px-6 sm:px-10 py-10 space-y-10">
        {/* Hero Section */}
        <Hero />

        {/* Top Scores & Metrics Panel */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ScoreGauge score={result?.atsScore ?? 0} />
          </div>

          <div className="lg:col-span-2">
            <StatsCards
              atsScore={result?.atsScore}
              jobMatch={result?.jobMatchScore}
              reports={reportsCount}
              salary={result?.salaryRange}
              loading={loading}
            />
          </div>
        </div>

        {/* Quick actions row */}
        <QuickActions />

        {/* Trends & Metric Highlights */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnalyticsChart data={chartData} />
          </div>

          <div className="lg:col-span-1 flex flex-col justify-between gap-5 mt-8">
            <div className="rounded-3xl border border-theme-border bg-theme-card/45 backdrop-blur-xl p-6 flex-1 flex flex-col justify-center shadow-[var(--shadow-card)] hover:border-theme-accent/25 transition">
              <p className="text-xs font-semibold text-theme-text-secondary tracking-wider uppercase">Highest ATS Match</p>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-theme-accent">
                {chartData.length ? Math.max(...chartData.map((x) => x.score)) : 0}%
              </h2>
            </div>

            <div className="rounded-3xl border border-theme-border bg-theme-card/45 backdrop-blur-xl p-6 flex-1 flex flex-col justify-center shadow-[var(--shadow-card)] hover:border-theme-accent/25 transition">
              <p className="text-xs font-semibold text-theme-text-secondary tracking-wider uppercase">Average Score</p>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-theme-accent">
                {chartData.length
                  ? Math.round(chartData.reduce((a, b) => a + b.score, 0) / chartData.length)
                  : 0}%
              </h2>
            </div>

            <div className="rounded-3xl border border-theme-border bg-theme-card/45 backdrop-blur-xl p-6 flex-1 flex flex-col justify-center shadow-[var(--shadow-card)] hover:border-theme-accent/25 transition">
              <p className="text-xs font-semibold text-theme-text-secondary tracking-wider uppercase">Total Submissions</p>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-theme-accent">
                {reportsCount}
              </h2>
            </div>
          </div>
        </div>

        {/* AI Analyzer Dropzone Form */}
        <section className="mt-12 space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">🚀 AI Resume Analyzer</h2>
            <p className="text-sm text-theme-text-secondary">Analyze your resume format and keywords against real job definitions.</p>
          </div>

          <div className="rounded-3xl border border-theme-border bg-theme-card/30 backdrop-blur-2xl p-6 sm:p-8 shadow-xl">
            {/* Custom drag zone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={!file ? selectFiles : undefined}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                file 
                  ? "border-theme-accent/20 bg-theme-card-hover/20 cursor-default" 
                  : dragActive
                  ? "border-theme-accent bg-theme-accent/5 scale-[1.01]"
                  : "border-theme-border hover:border-theme-accent/40 bg-theme-card/40 cursor-pointer"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                    setResult(null);
                  }
                }}
              />

              {!file ? (
                <div className="flex flex-col items-center justify-center space-y-3.5 py-4">
                  <div className="p-4 rounded-full bg-theme-accent/10 text-theme-accent">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Drag & drop your resume here, or <span className="text-theme-accent">browse</span></p>
                    <p className="text-xs text-theme-text-secondary mt-1.5">Supports PDF and DOCX formats up to 10MB</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3.5 bg-theme-card rounded-xl max-w-lg mx-auto border border-theme-border">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-lg bg-theme-accent/10 text-theme-accent">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm max-w-[200px] sm:max-w-xs truncate">{file.name}</p>
                      <p className="text-xs text-theme-text-secondary mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-theme-text-secondary hover:text-red-500 transition cursor-pointer"
                    title="Remove file"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Job Description Textarea */}
            <div className="mt-6 space-y-2">
              <label className="text-sm font-semibold text-theme-text-secondary uppercase tracking-wider">Job Target / Description (Optional)</label>
              <textarea
                placeholder="Paste the target job description here to optimize and check matching keywords..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full rounded-xl border border-theme-border bg-theme-bg-secondary/40 focus:bg-theme-bg-secondary/80 focus:border-theme-accent/50 focus:ring-1 focus:ring-theme-accent/30 p-4 text-sm text-theme-text transition outline-none resize-none leading-relaxed"
                rows={6}
              />
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !file}
              className={`mt-6 w-full rounded-2xl py-4 text-base font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                loading || !file
                  ? "bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-transparent"
                  : "bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:opacity-95 shadow-md shadow-indigo-600/20 active:scale-[0.995]"
              }`}
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Resume Layout & Keywords...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Execute AI Assessment</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Analysis Results Visualizer */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-14 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">✨ Analytics Assessment Result</h2>
                  <p className="text-sm text-theme-text-secondary">Fully compiled feedback and optimizations from RecruitFlow AI.</p>
                </div>
              </div>

              {/* Tabs list */}
              <div className="flex border-b border-theme-border gap-2 overflow-x-auto pb-px">
                {([
                  { id: "overview", label: "Overview & Scores" },
                  { id: "keywords", label: "Keywords & Strengths" },
                  { id: "enhancements", label: "AI Resume Enhancer" },
                  { id: "coach", label: "AI Career Prep" },
                ] as const).map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors duration-300 cursor-pointer ${
                        isActive ? "text-theme-accent" : "text-theme-text-secondary hover:text-theme-text"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-theme-accent"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Panels */}
              <div className="mt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === "overview" && (
                      <div className="space-y-6">
                        {/* Summary overview metrics */}
                        <div className="grid gap-5 md:grid-cols-4">
                          <ProgressCard title="ATS Layout Fit" value={result.atsScore} />
                          <ProgressCard title="Grammar & Style" value={result.grammarScore} />
                          <ProgressCard title="Formatting Structure" value={result.formattingScore} />
                          <ProgressCard title="Readability Level" value={result.readabilityScore} />
                        </div>

                        {/* Recruiter feedback */}
                        <FeedbackCard feedback={result.recruiterFeedback} />
                      </div>
                    )}

                    {activeTab === "keywords" && (
                      <div className="space-y-6">
                        {/* Keyword Card */}
                        <KeywordCard matchedKeywords={result.matchedKeywords} missingKeywords={result.missingKeywords} />

                        {/* Strengths & Weaknesses */}
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="rounded-2xl border border-emerald-500/20 bg-theme-card/30 backdrop-blur-xl p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-bold text-emerald-500 flex items-center gap-2">
                              <CheckCircle className="h-5 w-5" />
                              <span>✅ Key Strengths</span>
                            </h3>
                            <ul className="space-y-3 list-none">
                              {result.strengths.map((item, index) => (
                                <li key={index} className="flex gap-2 text-sm text-theme-text-secondary leading-relaxed">
                                  <span className="text-emerald-500 select-none">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-2xl border border-red-500/20 bg-theme-card/30 backdrop-blur-xl p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-bold text-red-500 flex items-center gap-2">
                              <AlertCircle className="h-5 w-5" />
                              <span>❌ Core Weaknesses</span>
                            </h3>
                            <ul className="space-y-3 list-none">
                              {result.weaknesses.map((item, index) => (
                                <li key={index} className="flex gap-2 text-sm text-theme-text-secondary leading-relaxed">
                                  <span className="text-red-500 select-none">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "enhancements" && (
                      <div className="space-y-6">
                        {/* Summary with copy button */}
                        <div className="relative rounded-2xl border border-theme-border bg-theme-card/30 backdrop-blur-xl p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-theme-accent flex items-center gap-2">
                              <Sparkles className="h-5 w-5" />
                              <span>✨ AI Optimized Summary</span>
                            </h3>
                            <button
                              onClick={() => handleCopy(result.rewrittenSummary, "summary")}
                              className="p-2 rounded-xl border border-theme-border hover:bg-theme-card-hover/40 text-theme-text-secondary hover:text-theme-text transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                            >
                              {copiedSummary ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                                  <span className="text-emerald-500">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="leading-relaxed text-sm text-theme-text-secondary whitespace-pre-wrap">
                            {result.rewrittenSummary}
                          </p>
                        </div>

                        {/* Suggestions and Download */}
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="rounded-2xl border border-amber-500/20 bg-theme-card/30 backdrop-blur-xl p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-bold text-amber-500 flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5" />
                              <span>💡 Layout Suggestions</span>
                            </h3>
                            <ul className="space-y-3 list-none">
                              {result.suggestions.map((item, index) => (
                                <li key={index} className="flex gap-2 text-sm text-theme-text-secondary leading-relaxed">
                                  <span className="text-amber-500 select-none">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-2xl border border-theme-border bg-theme-card/30 backdrop-blur-xl p-6 flex flex-col justify-between shadow-sm">
                            <div>
                              <h3 className="text-lg font-bold text-theme-text mb-2">📄 Export Evaluation Report</h3>
                              <p className="text-sm text-theme-text-secondary leading-relaxed">
                                Download a copy of your ATS report in PDF format to view keywords, suggestions, and scores offline.
                              </p>
                            </div>
                            <div className="mt-6">
                              <DownloadReportButton result={result} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "coach" && (
                      <div className="space-y-6">
                        {/* Cover Letter with copy button */}
                        <div className="relative rounded-2xl border border-theme-border bg-theme-card/30 backdrop-blur-xl p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-theme-accent flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              <span>📄 AI Generated Cover Letter</span>
                            </h3>
                            <button
                              onClick={() => handleCopy(result.coverLetter, "letter")}
                              className="p-2 rounded-xl border border-theme-border hover:bg-theme-card-hover/40 text-theme-text-secondary hover:text-theme-text transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                            >
                              {copiedCoverLetter ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                                  <span className="text-emerald-500">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="max-h-96 overflow-y-auto rounded-xl bg-theme-bg-secondary/40 p-4 border border-theme-border/50">
                            <p className="whitespace-pre-wrap leading-relaxed text-sm text-theme-text-secondary">
                              {result.coverLetter}
                            </p>
                          </div>
                        </div>

                        {/* Prep material */}
                        <div className="grid gap-6 md:grid-cols-2">
                          <InterviewCard questions={result.interviewQuestions} />

                          <div className="space-y-6">
                            <SalaryCard salary={result.salaryRange} />
                            <JobMatchCard matchScore={result.jobMatchScore} />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <footer className="border-t border-theme-border py-8 mt-16 bg-theme-bg/30 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-10">
          <div>
            <h2 className="font-extrabold text-theme-accent text-lg tracking-tight">RecruitFlow</h2>
            <p className="text-xs text-theme-text-secondary mt-0.5">
              AI-Powered Careers Platform
            </p>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-xs text-theme-text-secondary">
              Version 2.0.0
            </p>
            <p className="text-[10px] text-theme-text-muted mt-0.5">
              Built with Next.js • Supabase • Gemini AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
