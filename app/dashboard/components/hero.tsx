"use client";

import { Sparkles, FileCheck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mb-8 overflow-hidden rounded-3xl border border-indigo-500/10 dark:border-indigo-400/15 bg-gradient-to-r from-indigo-900/5 via-indigo-950/10 to-indigo-900/5 dark:from-slate-900/60 dark:to-slate-950/70 p-8 sm:p-10 shadow-xl"
    >
      {/* Background glowing shapes */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 mb-5">
          <Sparkles className="h-3 w-3 animate-pulse" />
          <span>Next-Gen Career Intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 dark:from-indigo-300 dark:via-violet-200 dark:to-cyan-300 drop-shadow-sm">
          Accelerate Your Job Search with AI
        </h1>

        <p className="mt-3.5 max-w-2xl text-base text-theme-text-secondary leading-relaxed">
          Analyze resume formats, optimize key phrases for Applicant Tracking Systems (ATS), auto-generate personalized cover letters, and prepare for interviews with standard interactive coaches.
        </p>

        <div className="mt-8 flex gap-3.5 flex-wrap">
          <div className="flex items-center gap-2 rounded-xl bg-theme-bg/60 border border-theme-border/60 px-4.5 py-2.5 text-xs font-medium shadow-[var(--shadow-card)]">
            <Sparkles className="text-indigo-500 h-4 w-4" />
            <span>AI Resume Optimization</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-theme-bg/60 border border-theme-border/60 px-4.5 py-2.5 text-xs font-medium shadow-[var(--shadow-card)]">
            <FileCheck className="text-cyan-500 h-4 w-4" />
            <span>ATS Compatibility Test</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-theme-bg/60 border border-theme-border/60 px-4.5 py-2.5 text-xs font-medium shadow-[var(--shadow-card)]">
            <CheckCircle className="text-emerald-500 h-4 w-4" />
            <span>Tailored Cover Letters</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}