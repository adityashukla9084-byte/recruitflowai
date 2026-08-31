type JobMatchCardProps = {
  matchScore: number;
};

function matchColor(score: number): string {
  if (score >= 80) return "var(--rf-match-high)";
  if (score >= 50) return "var(--rf-match-mid)";
  if (score > 0) return "var(--rf-match-low)";
  return "var(--text-muted)";
}

export default function JobMatchCard({ matchScore }: JobMatchCardProps) {
  const color = matchColor(matchScore);

  return (
    <div className="bg-theme-card border border-theme-border rounded-2xl p-4.5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 relative overflow-hidden group cursor-default">
      
      {/* Subtle indicator accent line on the left side of card */}
      <span 
        className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: color }}
      />

      <span className="text-[11px] font-bold uppercase tracking-widest text-theme-text-muted block mb-2 select-none">
        Job Match Score
      </span>
      <span
        className="text-xl font-bold leading-none"
        style={{
          color,
          fontFamily: "var(--font-geist-mono), monospace",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {matchScore}%
      </span>
      {/* Thin progress track */}
      <div 
        className="mt-3.5 h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: `color-mix(in srgb, ${color} 10%, var(--bg-card-hover))` }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(20,184,166,0.2)]"
          style={{ 
            width: `${matchScore}%`, 
            backgroundColor: color,
            boxShadow: matchScore > 0 ? `0 0 6px 0 ${color}` : undefined
          }}
        />
      </div>
    </div>
  );
}
