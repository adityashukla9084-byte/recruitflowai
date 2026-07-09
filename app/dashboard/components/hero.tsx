"use client";

import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <div className="pb-6 border-b border-theme-border/50">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 mb-4 shadow-sm">
        <Sparkles size={10} className="animate-pulse" />
        <span>ATS Intelligence Hub</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping ml-1" />
      </div>
      
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 dark:from-violet-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent mb-3">
        Candidate Evaluation Console
      </h1>
      
      <p className="text-sm text-theme-text-secondary leading-relaxed max-w-3xl">
        Upload a candidate's resume and supply the job parameters to construct an instant ATS
        compatibility scorecard, keyword alignment report, and professional recruiter feedback dashboard.
      </p>
    </div>
  );
}