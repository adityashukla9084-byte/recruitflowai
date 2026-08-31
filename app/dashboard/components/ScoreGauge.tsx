"use client";

import { motion } from "framer-motion";

type Props = {
  score: number;
};

// Semantic color map — the only place --rf-match colors appear on the page.
function getScoreAttributes(score: number): {
  stroke: string;
  verdict: string;
  verdictColor: string;
} {
  if (score >= 80) {
    return {
      stroke: "var(--rf-match-high)",
      verdict: "Strong Match",
      verdictColor: "var(--rf-match-high)",
    };
  }
  if (score >= 60) {
    return {
      stroke: "var(--rf-match-mid)",
      verdict: "Moderate Match",
      verdictColor: "var(--rf-match-mid)",
    };
  }
  if (score > 0) {
    return {
      stroke: "var(--rf-match-low)",
      verdict: "Needs Work",
      verdictColor: "var(--rf-match-low)",
    };
  }
  return {
    stroke: "var(--border-primary)",
    verdict: "No Analysis Yet",
    verdictColor: "var(--text-muted)",
  };
}

export default function ScoreGauge({ score }: Props) {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const { stroke, verdict, verdictColor } = getScoreAttributes(score);

  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center bg-theme-card border border-theme-border rounded-2xl p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 group">
      {/* Subtle interior radial gradient overlay and sci-fi tech lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03),transparent_75%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-theme-border/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-theme-border/5 pointer-events-none" />

      {/* Card label */}
      <p className="text-[11px] font-bold uppercase tracking-widest text-theme-text-muted mb-6 self-start relative z-10">
        ATS Match Score
      </p>

      {/* SVG Ring — the signature moment */}
      <div
        className="relative flex items-center justify-center z-10"
        style={{ width: 168, height: 168 }}
      >
        <svg
          width="168"
          height="168"
          className="absolute"
          style={{ transform: "rotate(-90deg)" }}
          aria-hidden="true"
        >
          {/* Track ring */}
          <circle
            cx="84"
            cy="84"
            r={radius}
            fill="transparent"
            stroke="var(--border-primary)"
            strokeWidth="5"
          />

          {/* Underlay glow ring (soft neon glow) */}
          {score > 0 && (
            <motion.circle
              cx="84"
              cy="84"
              r={radius}
              fill="transparent"
              stroke={stroke}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="opacity-20 blur-[2px]"
            />
          )}

          {/* Score ring — animated, semantic color */}
          <motion.circle
            cx="84"
            cy="84"
            r={radius}
            fill="transparent"
            stroke={stroke}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Glowing end tip dot indicator — rotates dynamically along arc */}
          {score > 0 && (
            <motion.g
              style={{ transformOrigin: "84px 84px" }}
              initial={{ rotate: 0 }}
              animate={{ rotate: (score / 100) * 360 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Outer soft halo */}
              <circle
                cx={84 + radius}
                cy={84}
                r="6"
                fill={stroke}
                className="opacity-30 blur-[1.5px]"
              />
              {/* Inner crisp indicator dot */}
              <circle
                cx={84 + radius}
                cy={84}
                r="3"
                fill="#FFFFFF"
                stroke={stroke}
                strokeWidth="1.5"
                className="shadow-[var(--shadow-card)]"
              />
            </motion.g>
          )}
        </svg>

        {/* Score number */}
        <div className="relative z-10 text-center flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="flex items-baseline justify-center gap-0.5"
          >
            <span
              className="text-[48px] font-semibold leading-none text-theme-text"
              style={{ fontFamily: "var(--font-geist-mono), monospace", fontVariantNumeric: "tabular-nums" }}
            >
              {score}
            </span>
            <span className="text-sm text-theme-text-muted font-normal mb-1">%</span>
          </motion.div>
        </div>
      </div>

      {/* Verdict label — uses the same semantic color as the ring, in a premium chip */}
      <div className="mt-6 text-center relative z-10">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-sm border select-none transition-all duration-300"
          style={{
            color: verdictColor,
            borderColor: `color-mix(in srgb, ${verdictColor} 20%, transparent)`,
            backgroundColor: `color-mix(in srgb, ${verdictColor} 8%, transparent)`,
          }}
        >
          {verdict}
        </span>
      </div>
    </div>
  );
}