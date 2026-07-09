"use client";

type Props = {
  atsScore?: number;
  jobMatch?: number;
  reports?: number;
  salary?: string;
  loading?: boolean;
};

function matchColor(score: number): string {
  if (score >= 80) return "var(--rf-match-high)";
  if (score >= 60) return "var(--rf-match-mid)";
  if (score > 0) return "var(--rf-match-low)";
  return "var(--text-muted)";
}

export default function StatsCards({
  atsScore = 0,
  jobMatch = 0,
  reports = 0,
  salary = "—",
  loading = false,
}: Props) {
  const stats = [
    {
      label: "ATS Score",
      value: `${atsScore}%`,
      semantic: true,
      score: atsScore,
      mono: true,
    },
    {
      label: "Job Match",
      value: `${jobMatch}%`,
      semantic: true,
      score: jobMatch,
      mono: true,
    },
    {
      label: "Reports Run",
      value: String(reports),
      semantic: false,
      score: 0,
      mono: true,
    },
    {
      label: "Salary Est.",
      value: salary,
      semantic: false,
      score: 0,
      mono: true,
    },
  ];

  return (
    // Isolated card tiles with gaps and premium hover effects
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, i) => {
        const dotColor = stat.semantic ? matchColor(stat.score) : "var(--border-primary)";
        const hasValue = stat.value && stat.value !== "—" && stat.value !== "0%" && stat.value !== "0";

        return (
          <div
            key={stat.label}
            className="flex flex-col justify-between p-4.5 bg-theme-card border border-theme-border/50 rounded-2xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 group cursor-default relative overflow-hidden"
          >
            {/* Soft backdrop glow matching value type */}
            {stat.semantic && hasValue && (
              <div 
                className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full blur-[24px] opacity-15 transition-opacity duration-300 group-hover:opacity-25"
                style={{ backgroundColor: dotColor }}
              />
            )}

            <div className="flex items-center gap-2 mb-2.5">
              <span
                className="w-2 h-2 rounded-full shrink-0 animate-pulse"
                style={{ backgroundColor: dotColor }}
                aria-hidden="true"
              />
              <span className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted select-none">
                {stat.label}
              </span>
            </div>

            {loading ? (
              <div className="h-6 w-16 animate-pulse rounded bg-theme-card-hover" />
            ) : (
              <span
                className="text-xl font-bold leading-none select-all"
                style={{
                  color: stat.semantic && hasValue ? matchColor(stat.score) : "var(--text-primary)",
                  fontFamily: stat.mono ? "var(--font-geist-mono), monospace" : undefined,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {stat.value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}