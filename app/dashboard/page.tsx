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
  FileSearch,
  Cpu,
  History,
  TrendingUp,
  Mic,
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
import KeywordComparison from "./components/KeywordComparison";
import QuickActions from "./components/QuickActions";
import AnalyticsChart from "./components/AnalyticsChart";
import InterviewTeaser from "./components/InterviewTeaser";

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
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("user_id", user.id);

        if (!profiles || profiles.length === 0) {
          await supabase.from("profiles").insert({
            user_id: user.id,
            full_name:
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              "",
            email: user.email,
            phone: "",
            education: "",
            universities: "",
            bio: "",
            linkedin: "",
            github: "",
          });
        }
      }
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
    <div className="flex-1 min-h-screen bg-theme-bg text-theme-text relative overflow-hidden">
      {/* Premium Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500/5 to-cyan-500/5 blur-[120px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-500/5 via-blue-500/10 to-cyan-500/5 blur-[100px] pointer-events-none animate-float-medium" />

      <Header />

      <div className="mx-auto max-w-7xl px-6 sm:px-10 py-4 pb-10 space-y-4 relative z-10">
        {/* Page context */}
        <Hero />

        {/* ── Split-Screen Workspace ── */}
        <div className="grid gap-4 lg:grid-cols-3 items-start">
          {/* Left Column: Upload Scanner & Results Tab Panel (col-span-2) */}
          <div className="lg:col-span-2 space-y-4" id="upload-section">
            <div className="space-y-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted mb-0.5">
                  Resume Analysis
                </p>
                <div className="flex items-center gap-2">
                  <UploadCloud size={14} className="text-sky-500" aria-hidden="true" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-theme-text">Upload &amp; Scan</h2>
                </div>
              </div>

              <div className="bg-theme-card border border-theme-border/50 rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 backdrop-blur-md">
                {/* Dropzone */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={!file ? selectFiles : undefined}
                  role={!file ? "button" : undefined}
                  tabIndex={!file ? 0 : undefined}
                  onKeyDown={!file ? (e) => e.key === "Enter" && selectFiles() : undefined}
                  aria-label={!file ? "Upload resume file" : undefined}
                  className={`group border-b border-theme-border/40 p-6 text-center transition-all duration-300 ${
                    file
                      ? "bg-theme-card"
                      : dragActive
                      ? "bg-sky-500/5 border-dashed border-sky-500/50 cursor-copy"
                      : "bg-theme-card hover:bg-theme-card-hover/20 cursor-pointer"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    aria-hidden="true"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                        setResult(null);
                      }
                    }}
                  />

                  {!file ? (
                    <div className="flex flex-col items-center gap-3.5">
                      {/* Icon wrapper badge */}
                      <div className="w-11 h-11 rounded-xl border border-theme-border bg-theme-bg-secondary/40 flex items-center justify-center shadow-sm group-hover:border-sky-500/35 group-hover:bg-theme-card-hover transition-all duration-300">
                        <UploadCloud
                          className="h-5 w-5 text-theme-text-muted group-hover:text-sky-500 transition-colors duration-300"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-theme-text">
                          Drop resume here or{" "}
                          <span
                            className="underline underline-offset-2 decoration-theme-text-muted font-medium"
                            style={{ color: "var(--accent)" }}
                          >
                            browse files
                          </span>
                        </p>
                        <p className="text-xs text-theme-text-muted mt-1">PDF or DOCX · max 10 MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between max-w-sm mx-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl border border-theme-border bg-theme-bg-secondary/40 flex items-center justify-center">
                          <FileText
                            className="h-4.5 w-4.5 text-theme-text-secondary shrink-0"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-theme-text font-medium truncate max-w-[180px] sm:max-w-xs">
                            {file.name}
                          </p>
                          <p className="text-xs text-theme-text-muted font-mono">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearFile();
                        }}
                        className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-card-hover transition-colors duration-150 cursor-pointer focus-visible:outline-2"
                        title="Remove file"
                        aria-label="Remove file"
                      >
                        <X className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Job Description textarea */}
                <div className="p-4 border-b border-theme-border/40 bg-theme-bg-secondary/10">
                  <label
                    htmlFor="job-description"
                    className="block text-[9px] font-bold uppercase tracking-widest text-theme-text-muted mb-2.5 select-none"
                  >
                    Job Description{" "}
                    <span className="normal-case font-normal text-theme-text-muted">
                      (optional)
                    </span>
                  </label>
                  <div className="rounded-xl border border-theme-border/50 p-3 bg-theme-bg-secondary/30 focus-within:border-sky-500/40 focus-within:ring-2 focus-within:ring-sky-500/10 transition-all duration-200">
                    <textarea
                      id="job-description"
                      placeholder="Paste the job requisition text to check keyword alignment..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full bg-transparent text-sm text-theme-text placeholder:text-theme-text-muted outline-none resize-none leading-relaxed focus-visible:outline-none"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Analyze button */}
                <div className="p-3 bg-theme-bg-secondary/20">
                  <button
                    id="analyze-btn"
                    onClick={handleAnalyze}
                    disabled={loading || !file}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 hover:scale-[1.005] active:scale-[0.995] bg-theme-text text-theme-bg shadow-md hover:shadow-lg hover:opacity-90"
                  >
                    {loading ? (
                      <>
                        <div
                          className="h-3.5 w-3.5 rounded-full border-[1.5px] border-white/25 border-t-white animate-spin"
                          aria-hidden="true"
                        />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" strokeWidth={1.5} aria-hidden="true" />
                        <span>Run AI Analysis</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ── Zone 2: Analysis Results (Inside Left Column) ── */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading-skeleton"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4 border-t border-theme-border/50 pt-6 animate-pulse"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-theme-text-muted animate-spin" />
                    <div className="h-4 w-32 rounded bg-theme-card-hover" />
                  </div>
                  {/* Tab row skeleton */}
                  <div className="flex gap-2 border-b border-theme-border/40 overflow-x-auto">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="px-4 py-2.5">
                        <div className="h-4 w-16 rounded bg-theme-card-hover" />
                      </div>
                    ))}
                  </div>
                  {/* Panel skeletons */}
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-theme-card border border-theme-border/50 rounded-2xl p-4 h-[72px] flex flex-col justify-between shadow-[var(--shadow-card)]">
                          <div className="h-2.5 w-14 rounded bg-theme-card-hover" />
                          <div className="h-5 w-8 rounded bg-theme-card-hover" />
                        </div>
                      ))}
                    </div>
                    <div className="bg-theme-card border border-theme-border/50 rounded-2xl p-5 space-y-3 shadow-[var(--shadow-card)]">
                      <div className="h-3 w-28 rounded bg-theme-card-hover" />
                      <div className="h-3 w-full rounded bg-theme-card-hover" />
                      <div className="h-3 w-5/6 rounded bg-theme-card-hover" />
                      <div className="h-3 w-4/5 rounded bg-theme-card-hover" />
                    </div>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.section
                  key="results-section"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 border-t border-theme-border/50 pt-6"
                  aria-label="Analysis results"
                >
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted mb-0.5">
                      Analysis Output
                    </p>
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-sky-500" aria-hidden="true" />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-theme-text">Assessment Results</h2>
                    </div>
                  </div>

                  {/* Tab row - capsule style */}
                  <div
                    className="flex gap-1.5 p-1 bg-theme-bg-secondary/40 border border-theme-border/50 rounded-xl overflow-x-auto max-w-max mb-2 backdrop-blur-sm shadow-sm"
                    role="tablist"
                    aria-label="Result sections"
                  >
                    {([
                      { id: "overview", label: "Scores" },
                      { id: "keywords", label: "Keywords" },
                      { id: "enhancements", label: "Enhancements" },
                      { id: "coach", label: "Career Prep" },
                    ] as const).map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          id={`tab-${tab.id}`}
                          role="tab"
                          aria-selected={isActive}
                          aria-controls={`panel-${tab.id}`}
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer rounded-lg ${
                            isActive
                              ? "text-theme-text"
                              : "text-theme-text-muted hover:text-theme-text-secondary"
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeTabBar"
                              className="absolute inset-0 bg-theme-card border border-theme-border/60 rounded-[6px] shadow-sm"
                              style={{ zIndex: 0 }}
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                              aria-hidden="true"
                            />
                          )}
                          <span className="relative z-10">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab panels */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      id={`panel-${activeTab}`}
                      role="tabpanel"
                      aria-labelledby={`tab-${activeTab}`}
                    >
                      {activeTab === "overview" && (
                        <div className="space-y-4">
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <ProgressCard title="ATS Layout" value={result.atsScore} />
                            <ProgressCard title="Grammar" value={result.grammarScore} />
                            <ProgressCard title="Formatting" value={result.formattingScore} />
                            <ProgressCard title="Readability" value={result.readabilityScore} />
                          </div>
                          <FeedbackCard feedback={result.recruiterFeedback} />
                        </div>
                      )}

                      {activeTab === "keywords" && (
                        <div className="space-y-4">
                          <KeywordCard
                            matchedKeywords={result.matchedKeywords}
                            missingKeywords={result.missingKeywords}
                          />
                          <div className="grid gap-4 md:grid-cols-2">
                            {/* Strengths */}
                            <div className="bg-theme-card border border-theme-border rounded-lg p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 backdrop-blur-md">
                              <h3 className="text-[10px] font-medium uppercase tracking-widest text-theme-text-muted mb-4">
                                Strengths
                              </h3>
                              <ul className="space-y-2.5" aria-label="Strengths list">
                                {result.strengths.map((item, index) => (
                                  <li
                                    key={index}
                                    className="flex gap-3 text-sm text-theme-text-secondary leading-relaxed"
                                  >
                                    <span
                                      className="mt-[7px] w-[5px] h-[5px] rounded-full shrink-0"
                                      style={{ backgroundColor: "var(--rf-match-high)" }}
                                      aria-hidden="true"
                                    />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {/* Gaps */}
                            <div className="bg-theme-card border border-theme-border rounded-lg p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 backdrop-blur-md">
                              <h3 className="text-[10px] font-medium uppercase tracking-widest text-theme-text-muted mb-4">
                                Gaps
                              </h3>
                              <ul className="space-y-2.5" aria-label="Weaknesses list">
                                {result.weaknesses.map((item, index) => (
                                  <li
                                    key={index}
                                    className="flex gap-3 text-sm text-theme-text-secondary leading-relaxed"
                                  >
                                    <span
                                      className="mt-[7px] w-[5px] h-[5px] rounded-full shrink-0"
                                      style={{ backgroundColor: "var(--rf-match-low)" }}
                                      aria-hidden="true"
                                    />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "enhancements" && (
                        <div className="space-y-4">
                          {/* Optimized Summary */}
                          <div className="bg-theme-card border border-theme-border rounded-lg p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 backdrop-blur-md">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-[10px] font-medium uppercase tracking-widest text-theme-text-muted">
                                Optimized Summary
                              </h3>
                              <button
                                onClick={() => handleCopy(result.rewrittenSummary, "summary")}
                                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-theme-border text-theme-text-muted hover:text-theme-text hover:bg-theme-card-hover transition-colors duration-150 cursor-pointer focus-visible:outline-2"
                                aria-label="Copy optimized summary"
                              >
                                {copiedSummary ? (
                                  <>
                                    <Check className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <p className="text-sm text-theme-text-secondary leading-7 whitespace-pre-wrap">
                              {result.rewrittenSummary}
                            </p>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            {/* Layout suggestions */}
                            <div className="bg-theme-card border border-theme-border rounded-lg p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 backdrop-blur-md">
                              <h3 className="text-[10px] font-medium uppercase tracking-widest text-theme-text-muted mb-4">
                                Layout Suggestions
                              </h3>
                              <ol className="space-y-2.5" aria-label="Layout suggestions">
                                {result.suggestions.map((item, index) => (
                                  <li
                                    key={index}
                                    className="flex gap-3 text-sm text-theme-text-secondary leading-relaxed"
                                  >
                                    <span
                                      className="shrink-0 text-xs text-theme-text-muted tabular-nums mt-0.5 w-5 text-right"
                                      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                                      aria-hidden="true"
                                    >
                                      {String(index + 1).padStart(2, "0")}.
                                    </span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>

                            {/* Export */}
                            <div className="bg-theme-card border border-theme-border rounded-lg p-5 flex flex-col shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 backdrop-blur-md">
                              <h3 className="text-[10px] font-medium uppercase tracking-widest text-theme-text-muted mb-2">
                                Export Report
                              </h3>
                              <p className="text-xs text-theme-text-muted leading-relaxed mt-1 flex-1">
                                Download a PDF with ATS scores, keyword gaps, and recruiter feedback.
                              </p>
                              <div className="mt-5">
                                <DownloadReportButton result={result} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "coach" && (
                        <div className="space-y-4">
                          {/* Cover letter */}
                          <div className="bg-theme-card border border-theme-border rounded-lg p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 backdrop-blur-md">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-[10px] font-medium uppercase tracking-widest text-theme-text-muted">
                                Cover Letter Draft
                              </h3>
                              <button
                                onClick={() => handleCopy(result.coverLetter, "letter")}
                                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-theme-border text-theme-text-muted hover:text-theme-text hover:bg-theme-card-hover transition-colors duration-150 cursor-pointer focus-visible:outline-2"
                                aria-label="Copy cover letter draft"
                              >
                                {copiedCoverLetter ? (
                                  <>
                                    <Check className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                              <p className="text-sm text-theme-text-secondary leading-7 whitespace-pre-wrap">
                                {result.coverLetter}
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <InterviewCard questions={result.interviewQuestions} />
                            <div className="space-y-3">
                              <SalaryCard salary={result.salaryRange} />
                              <JobMatchCard matchScore={result.jobMatchScore} />
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.section>
              ) : (
                <motion.div
                  key="empty-placeholder"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4 border-t border-theme-border/50 pt-6 select-none"
                >
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted mb-0.5">
                      Analysis Output
                    </p>
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-theme-text-muted" aria-hidden="true" />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-theme-text text-theme-text-muted">Assessment Results</h2>
                    </div>
                  </div>

                  {/* Tab row placeholder */}
                  <div className="flex border-b border-theme-border/40 overflow-x-auto opacity-40">
                    {["Scores", "Keywords", "Enhancements", "Career Prep"].map((tab, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2.5 text-xs text-theme-text-muted font-semibold border-b-2 border-transparent"
                      >
                        {tab}
                      </span>
                    ))}
                  </div>

                  {/* Dashed placeholder container */}
                  <div className="border border-dashed border-theme-border/50 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-4 bg-theme-bg-secondary/10 shadow-[var(--shadow-card)] hover:border-sky-500/20 transition-all duration-300">
                    <div className="w-11 h-11 rounded-xl border border-theme-border bg-theme-bg-secondary/40 flex items-center justify-center text-theme-text-muted">
                      <FileSearch size={16} strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <div className="space-y-1.5 max-w-xs">
                      <p className="text-sm font-semibold text-theme-text">Ready for analysis</p>
                      <p className="text-xs text-theme-text-muted leading-relaxed">
                        Select a candidate file and click "Run AI Analysis" to extract compatibility scores and gaps.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Zone 4: Trend & History (Moved to Left Column for balance) */}
              <div className="space-y-3 border-t border-theme-border/30 pt-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted mb-0.5">
                    History
                  </p>
                  <div className="flex items-center gap-2">
                    <History size={14} className="text-sky-500" aria-hidden="true" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-theme-text">Score Trend</h2>
                  </div>
                </div>
                <AnalyticsChart data={chartData} />

                <div className="grid grid-cols-3 gap-2">
                  {/* Best score */}
                  <div className="bg-theme-card border border-theme-border/50 rounded-xl p-2.5 text-center shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 backdrop-blur-md">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted block mb-1">
                      Best
                    </span>
                    <span
                      className="text-sm font-bold leading-none"
                      style={{
                        color: "var(--rf-match-high)",
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {chartData.length
                        ? `${Math.max(...chartData.map((x) => x.score))}%`
                        : "—"}
                    </span>
                  </div>

                  {/* Average */}
                  <div className="bg-theme-card border border-theme-border/50 rounded-xl p-2.5 text-center shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 backdrop-blur-md">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted block mb-1">
                      Avg
                    </span>
                    <span
                      className="text-sm font-bold leading-none text-theme-text"
                      style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {chartData.length
                        ? `${Math.round(
                            chartData.reduce((a, b) => a + b.score, 0) / chartData.length
                          )}%`
                        : "—"}
                    </span>
                  </div>

                  {/* Total runs */}
                  <div className="bg-theme-card border border-theme-border/50 rounded-xl p-2.5 text-center shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 backdrop-blur-md">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted block mb-1">
                      Runs
                    </span>
                    <span
                      className="text-sm font-bold leading-none text-theme-text"
                      style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {reportsCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          {/* Right Column: Score Console, Trend Charts, and History (col-span-1) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Zone 3: Match Quality */}
            <div className="space-y-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted mb-0.5">
                  Match Quality
                </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-sky-500" aria-hidden="true" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-theme-text">Score Console</h2>
                  </div>
                </div>
                <KeywordComparison
                  matchedKeywords={result?.matchedKeywords ?? []}
                  missingKeywords={result?.missingKeywords ?? []}
                />
              <StatsCards
                atsScore={result?.atsScore}
                jobMatch={result?.jobMatchScore}
                reports={reportsCount}
                salary={result?.salaryRange}
                loading={loading}
              />
            </div>



            {/* Zone 5: Coaching Insights */}
            <div className="space-y-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted mb-0.5">
                  Coaching Insights
                </p>
                <div className="flex items-center gap-2">
                  <Mic size={14} className="text-sky-500" aria-hidden="true" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-theme-text">Last Interview</h2>
                </div>
              </div>
              <InterviewTeaser />
            </div>
          </div>
        </div>

        {/* ── AI Tools Grid (Full Width at Bottom) ── */}
        <div className="space-y-4 border-t border-theme-border/50 pt-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted mb-0.5">
              Platform
            </p>
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-sky-500" aria-hidden="true" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-theme-text">AI Tools &amp; Copilots</h2>
            </div>
          </div>
          <QuickActions />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-theme-border/40 py-5 bg-theme-bg-secondary/10">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 sm:px-10">
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-sm"
              style={{ backgroundColor: "var(--accent)" }}
              aria-hidden="true"
            />
            <span className="text-xs text-theme-text-muted font-semibold">RecruitFlow</span>
          </div>
          <span
            className="text-xs text-theme-text-muted"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            v2.0.0
          </span>
        </div>
      </footer>
    </div>
  );
}
