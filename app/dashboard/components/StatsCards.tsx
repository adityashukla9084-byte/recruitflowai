"use client";

type Props = {
  atsScore?: number;
  jobMatch?: number;
  reports?: number;
  salary?: string;
  loading?: boolean;
};

function matchColor(score: number): string {
  if (score >= 80) return "var(--rf-match-high)"; // Green (strong)
  if (score >= 50) return "var(--rf-match-mid)";  // Amber (moderate)
  if (score > 0) return "var(--rf-match-low)";    // Red (weak)
  return "var(--text-muted)";
}

function matchVerdict(score: number): string {
  if (score >= 80) return "Strong Match";
  if (score >= 50) return "Moderate Match";
  if (score > 0) return "Weak Match";
  return "Awaiting Scan";
}

export default function StatsCards({
  atsScore = 0,
  jobMatch = 0,
  reports = 0,
  salary = "—",
  loading = false,
}: Props) {
  const hasAtsValue = atsScore > 0;
  const atsColor = hasAtsValue ? matchColor(atsScore) : "var(--text-muted)";
  const verdict = matchVerdict(atsScore);

  const secondaryStats = [
    {
      label: "Job Match",
      value: jobMatch > 0 ? `${jobMatch}%` : "—",
      color: jobMatch > 0 ? matchColor(jobMatch) : "var(--text-muted)",
      hasValue: jobMatch > 0,
      mono: true,
      pulse: jobMatch === 0,
    },
    {
      label: "Reports Run",
      value: String(reports),
      color: "var(--text-accent)",
      hasValue: reports > 0,
      mono: true,
      pulse: false,
    },
    {
      label: "Salary Est.",
      value: salary,
      color: "var(--text-accent)",
      hasValue: salary && salary !== "—",
      mono: true,
      pulse: false,
    },
  ];

  return (
    <div className="space-y-3">
      {/* ── ATS Score Hero Card ── */}
      <div className="bg-theme-card border border-theme-border rounded-2xl p-4.5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 group cursor-default relative overflow-hidden">
        {/* Soft color bloom matching match status */}
        {hasAtsValue && (
          <div 
            className="absolute -right-10 -top-10 w-28 h-28 rounded-full opacity-15 transition-opacity duration-300 group-hover:opacity-25 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${atsColor} 0%, transparent 70%)` }}
          />
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${hasAtsValue ? "animate-pulse" : ""}`}
              style={{ backgroundColor: atsColor }}
              aria-hidden="true"
            />
            <span className="text-xs font-bold uppercase tracking-widest text-theme-text-muted select-none">
              ATS Score
            </span>
          </div>

          <span
            className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border transition-all duration-300 select-none"
            style={{
              color: atsColor,
              borderColor: `color-mix(in srgb, ${atsColor} 20%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${atsColor} 8%, transparent)`,
            }}
          >
            {verdict}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          {loading ? (
            <div className="h-16 w-32 animate-pulse rounded bg-theme-card-hover" />
          ) : (
            <>
              {hasAtsValue ? (
                <>
                  <span
                    className="text-5xl sm:text-6xl font-black leading-none tracking-tighter"
                    style={{
                      color: atsColor,
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {atsScore}
                  </span>
                  <span className="text-xl text-theme-text-muted font-normal">%</span>
                </>
              ) : (
                <span
                  className="text-5xl sm:text-6xl font-black leading-none tracking-tighter text-theme-text-muted animate-pulse"
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                  }}
                >
                  ——
                </span>
              )}
            </>
          )}
        </div>

        {/* Custom progress slider / grayed-out pulsing placeholder */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-theme-text-muted font-mono select-none">
            <span>WEAK</span>
            <span>MODERATE</span>
            <span>STRONG</span>
          </div>
          {hasAtsValue ? (
            <div className="h-1.5 w-full rounded-full bg-theme-bg-secondary/40 overflow-hidden relative border border-theme-border/20">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${atsScore}%`,
                  backgroundColor: atsColor,
                  boxShadow: `0 0 8px ${atsColor}`,
                }}
              />
            </div>
          ) : (
            <div className="h-1.5 w-full rounded-full bg-theme-border/10 overflow-hidden relative border border-theme-border/5 animate-pulse">
              <div className="h-full bg-theme-border/20 w-1/4 rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* ── Secondary Small Chips Row ── */}
      <div className="grid grid-cols-3 gap-2">
        {secondaryStats.map((stat) => {
          return (
            <div
              key={stat.label}
              className="flex flex-col justify-between p-2.5 bg-theme-card border border-theme-border rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 cursor-default relative overflow-hidden group"
            >
              <span className="text-[8px] font-extrabold uppercase tracking-wider text-theme-text-muted select-none mb-2 block truncate">
                {stat.label}
              </span>

              {loading ? (
                <div className="h-5 w-12 animate-pulse rounded bg-theme-card-hover" />
              ) : (
                <span
                  className={`text-sm sm:text-base font-bold leading-none select-all truncate ${stat.pulse ? "text-theme-text-muted animate-pulse" : ""}`}
                  style={{
                    color: stat.hasValue && stat.mono ? stat.color : undefined,
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
    </div>
  );
}
