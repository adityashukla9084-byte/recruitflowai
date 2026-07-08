"use client";

import { motion } from "framer-motion";

type Props = {
  score: number;
};

export default function ScoreGauge({ score }: Props) {
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Determine colors and label based on score
  let strokeColor = "#3b82f6"; // default blue
  let label = "Needs Work";
  let textColor = "text-red-500 dark:text-red-400";

  if (score >= 80) {
    strokeColor = "#10b981"; // green
    label = "Ready to Apply";
    textColor = "text-emerald-500 dark:text-emerald-400";
  } else if (score >= 60) {
    strokeColor = "#f59e0b"; // yellow/orange
    label = "Competitive";
    textColor = "text-amber-500 dark:text-amber-400";
  } else if (score > 0) {
    strokeColor = "#ef4444"; // red
    label = "Needs Optimization";
  } else {
    strokeColor = "#64748b"; // slate grey for 0
    label = "No Resume Loaded";
    textColor = "text-theme-text-muted";
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-theme-border-card bg-theme-card/45 backdrop-blur-xl p-8 h-full shadow-[var(--shadow-card)] transition-all duration-300 hover:border-theme-accent/25 hover:shadow-lg">
      <h3 className="text-sm font-semibold text-theme-text-secondary tracking-wider uppercase mb-5">
        ATS Quality Match
      </h3>

      <div className="relative h-48 w-48 flex items-center justify-center">
        {/* Glow Filters */}
        <svg className="absolute rotate-[-90deg]" width="192" height="192">
          <defs>
            <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Underlay Track */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            className="text-slate-200 dark:text-slate-800/60"
            fill="transparent"
          />

          {/* Animated Glow Outline */}
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              filter: score > 0 ? "url(#gauge-glow)" : "none",
            }}
          />
        </svg>

        {/* Central Score Text */}
        <div className="text-center z-10">
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-5xl font-black tracking-tight"
          >
            {score}
            <span className="text-2xl font-semibold opacity-70">%</span>
          </motion.p>
          <p className={`text-xs font-semibold mt-1 uppercase tracking-wider ${textColor}`}>
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}