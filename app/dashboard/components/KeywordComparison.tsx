"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, FileSearch } from "lucide-react";

type Props = {
  matchedKeywords: string[];
  missingKeywords: string[];
};

// Placeholder keywords for empty/inactive states
const placeholderMatched = ["React", "TypeScript", "Node.js", "REST APIs", "Tailwind CSS"];
const placeholderMissing = ["AWS", "Docker", "CI/CD", "Kubernetes", "GraphQL"];

export default function KeywordComparison({
  matchedKeywords = [],
  missingKeywords = [],
}: Props) {
  const isAnalyzed = matchedKeywords.length > 0 || missingKeywords.length > 0;

  const matched = isAnalyzed ? matchedKeywords : placeholderMatched;
  const missing = isAnalyzed ? missingKeywords : placeholderMissing;

  return (
    <div className="bg-theme-card border border-theme-border/50 rounded-2xl p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 group cursor-default relative overflow-hidden">
      {/* Dynamic tech grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.02),transparent_70%)] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted select-none">
            Keyword Alignment
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text mt-0.5">
            Resume vs. Job Requisition
          </h3>
        </div>

        {isAnalyzed && (
          <span className="text-[10px] font-mono text-theme-text-muted bg-theme-bg-secondary/50 border border-theme-border/30 px-2 py-0.5 rounded">
            Match Ratio: {Math.round((matched.length / (matched.length + missing.length)) * 100 || 0)}%
          </span>
        )}
      </div>

      <div className="relative">
        {/* Empty state glass overlay */}
        {!isAnalyzed && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-theme-card/30 backdrop-blur-[2px] rounded-xl border border-dashed border-theme-border/30 p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-theme-bg-secondary/60 flex items-center justify-center text-theme-text-muted mb-3 border border-theme-border/50">
              <FileSearch size={16} strokeWidth={1.5} className="animate-pulse" />
            </div>
            <h4 className="text-xs font-bold text-theme-text mb-1">Awaiting analysis data</h4>
            <p className="text-[10px] text-theme-text-muted max-w-xs leading-normal">
              Compare matched and missing keywords side-by-side once you run the AI analyzer.
            </p>
          </div>
        )}

        {/* Side-by-side keyword container */}
        <div className={`grid grid-cols-2 gap-4 select-none relative z-10 ${!isAnalyzed ? "opacity-30 blur-[1px]" : ""}`}>
          
          {/* ── Left Column: Matched Keywords ── */}
          <div className="space-y-3 pr-2 border-r border-theme-border/30">
            <div className="flex items-center gap-1.5 pb-2 border-b border-theme-border/20">
              <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/90">
                Found ({matched.length})
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pt-1 content-start">
              {matched.map((word, idx) => (
                <motion.span
                  key={`match-${word}-${idx}`}
                  initial={isAnalyzed ? { scale: 0.8, opacity: 0 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05, duration: 0.2 }}
                  className="inline-flex items-center px-2 py-1 text-[11px] font-semibold rounded-md border"
                  style={{
                    color: "var(--rf-match-high)",
                    backgroundColor: "color-mix(in srgb, var(--rf-match-high) 8%, transparent)",
                    borderColor: "color-mix(in srgb, var(--rf-match-high) 20%, transparent)",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </div>

          {/* ── Right Column: Missing Keywords ── */}
          <div className="space-y-3 pl-2">
            <div className="flex items-center gap-1.5 pb-2 border-b border-theme-border/20">
              <AlertTriangle size={12} className="text-rose-500 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500/90">
                Missing ({missing.length})
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pt-1 content-start">
              {missing.map((word, idx) => (
                <motion.span
                  key={`miss-${word}-${idx}`}
                  initial={isAnalyzed ? { scale: 0.8, opacity: 0 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05, duration: 0.2 }}
                  className="inline-flex items-center px-2 py-1 text-[11px] font-semibold rounded-md border"
                  style={{
                    color: "var(--rf-match-low)",
                    backgroundColor: "color-mix(in srgb, var(--rf-match-low) 8%, transparent)",
                    borderColor: "color-mix(in srgb, var(--rf-match-low) 20%, transparent)",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
