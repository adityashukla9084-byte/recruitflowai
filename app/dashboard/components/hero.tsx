"use client";

import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <div className="pb-4 border-b border-theme-border">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-theme-accent/10 text-theme-accent border border-theme-accent/20 mb-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
        <Sparkles size={10} className="animate-pulse text-theme-accent" />
        <span style={{ fontFamily: "var(--font-geist-mono), monospace" }}>Executive Intelligence Hub</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping ml-1" />
      </div>
      
      <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-theme-text mb-3 leading-none">
        Candidate <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-accent to-white">Evaluation</span> Console
      </h1>
      
      <p className="text-xs sm:text-sm text-theme-text-secondary leading-relaxed max-w-3xl">
        Upload a candidate's resume and supply the job parameters to construct an instant ATS
        compatibility scorecard, keyword alignment report, and professional recruiter feedback dashboard.
      </p>
    </div>
  );
}