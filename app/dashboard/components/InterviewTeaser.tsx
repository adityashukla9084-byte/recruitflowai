"use client";

import Link from "next/link";
import { Mic, ArrowRight, Gauge, HelpCircle, MessageSquare } from "lucide-react";

export default function InterviewTeaser() {
  return (
    <div className="bg-theme-card border border-theme-border rounded-2xl p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 relative overflow-hidden group cursor-default">
      {/* Indicator border on hover */}
      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-theme-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-center justify-between mb-4 select-none">
        <span className="text-[11px] font-bold uppercase tracking-widest text-theme-accent bg-theme-accent/10 px-2 py-0.5 rounded">
          AI Feedback Teaser
        </span>
        <span className="text-xs font-mono text-theme-text-muted">
          Jul 09, 2026
        </span>
      </div>

      <h3 className="text-xs font-bold text-theme-text mb-3">
        Technical Screening Performance
      </h3>

      <div className="space-y-3">
        {/* Metagrid of feedback insights */}
        <div className="grid grid-cols-3 gap-2">
          {/* Pacing */}
          <div className="bg-theme-bg-secondary/40 border border-theme-border/30 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-theme-text-muted mb-1 select-none">
              <Gauge size={10} />
              <span className="text-[8px] font-bold uppercase tracking-wider">Pacing</span>
            </div>
            <span className="text-xs font-bold text-emerald-500 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              Good
            </span>
          </div>

          {/* Filler Words */}
          <div className="bg-theme-bg-secondary/40 border border-theme-border/30 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-theme-text-muted mb-1 select-none">
              <MessageSquare size={10} />
              <span className="text-[8px] font-bold uppercase tracking-wider">Fillers</span>
            </div>
            <span className="text-xs font-bold text-[#D4AF37]">
              "Um" &times; 6
            </span>
          </div>

          {/* Technical Accuracy */}
          <div className="bg-theme-bg-secondary/40 border border-theme-border/30 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-theme-text-muted mb-1 select-none">
              <HelpCircle size={10} />
              <span className="text-[8px] font-bold uppercase tracking-wider">Accuracy</span>
            </div>
            <span
              className="text-xs font-bold text-theme-accent"
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              78%
            </span>
          </div>
        </div>

        {/* Small motivational hint */}
        <p className="text-xs text-theme-text-muted leading-relaxed select-none">
          Communication was clear, but accuracy fell short in System Design. Practice another screen to improve scoring metrics.
        </p>

        {/* CTA link to launch interview simulator */}
        <Link
          href="/dashboard/interview"
          className="mt-2 flex items-center justify-between p-2 rounded-xl border border-theme-border/40 bg-theme-bg-secondary/20 hover:bg-theme-bg-secondary/50 transition-colors duration-200"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-theme-text group-hover:text-theme-accent transition-colors duration-300">
            Practice Mock Interview
          </span>
          <ArrowRight
            size={12}
            className="text-theme-text-muted group-hover:text-theme-accent group-hover:translate-x-0.5 transition-all"
          />
        </Link>
      </div>
    </div>
  );
}
