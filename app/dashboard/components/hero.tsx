"use client";

import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <div className="pb-4 border-b border-theme-border/50">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 mb-4 shadow-sm">
        <Sparkles size={10} className="animate-pulse" />
        <span style={{ fontFamily: "var(--font-geist-mono), monospace" }}>ATS Intelligence Hub</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping ml-1" />
      </div>
      
      <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-theme-text mb-3 leading-none">
        Candidate <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Evaluation</span> Console
      </h1>
      
      <p className="text-xs sm:text-sm text-theme-text-secondary leading-relaxed max-w-3xl">
        Upload a candidate's resume and supply the job parameters to construct an instant ATS
        compatibility scorecard, keyword alignment report, and professional recruiter feedback dashboard.
      </p>
    </div>
  );
}