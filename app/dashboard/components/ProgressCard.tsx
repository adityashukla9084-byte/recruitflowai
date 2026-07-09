type ProgressCardProps = {
  title: string;
  value: number;
};

function barColor(score: number): string {
  if (score >= 80) return "var(--rf-match-high)";
  if (score >= 50) return "var(--rf-match-mid)";
  if (score > 0) return "var(--rf-match-low)";
  return "var(--border-primary)";
}

export default function ProgressCard({ title, value }: ProgressCardProps) {
  const color = barColor(value);

  return (
    <div className="bg-theme-card border border-theme-border/50 rounded-2xl p-4.5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 cursor-default relative overflow-hidden group">
      
      {/* Subtle indicator accent line on the left side of card */}
      <span 
        className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-baseline justify-between mb-3.5">
        <span className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted">
          {title}
        </span>
        <span
          className="text-sm font-bold leading-none"
          style={{
            color,
            fontFamily: "var(--font-geist-mono), monospace",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}%
        </span>
      </div>
      {/* 4px double layered track with soft glow shadow */}
      <div 
        className="h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: `color-mix(in srgb, ${color} 10%, var(--bg-card-hover))` }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(99,102,241,0.2)]"
          style={{ 
            width: `${value}%`, 
            backgroundColor: color,
            boxShadow: value > 0 ? `0 0 6px 0 ${color}` : undefined
          }}
        />
      </div>
    </div>
  );
}