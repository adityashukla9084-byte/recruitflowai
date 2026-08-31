type KeywordCardProps = {
  matchedKeywords: string[];
  missingKeywords: string[];
};

export default function KeywordCard({
  matchedKeywords,
  missingKeywords,
}: KeywordCardProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Matched */}
      <div className="bg-theme-card border border-theme-border rounded-2xl p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 relative overflow-hidden group">
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-theme-text-muted mb-4 select-none">
          Matched Keywords
        </h3>
        <div className="flex flex-wrap gap-2">
          {matchedKeywords.length > 0 ? (
            matchedKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all duration-200"
                style={{
                  color: "var(--rf-match-high)",
                  backgroundColor: "color-mix(in srgb, var(--rf-match-high) 8%, transparent)",
                  borderColor: "color-mix(in srgb, var(--rf-match-high) 20%, transparent)",
                }}
              >
                {keyword}
              </span>
            ))
          ) : (
            <span className="text-xs text-theme-text-muted italic">No matched keywords</span>
          )}
        </div>
      </div>

      {/* Missing */}
      <div className="bg-theme-card border border-theme-border rounded-2xl p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 relative overflow-hidden group">
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-theme-text-muted mb-4 select-none">
          Missing Keywords
        </h3>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.length > 0 ? (
            missingKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all duration-200"
                style={{
                  color: "var(--rf-match-low)",
                  backgroundColor: "color-mix(in srgb, var(--rf-match-low) 8%, transparent)",
                  borderColor: "color-mix(in srgb, var(--rf-match-low) 20%, transparent)",
                }}
              >
                {keyword}
              </span>
            ))
          ) : (
            <span className="text-xs text-theme-text-muted italic">No missing keywords</span>
          )}
        </div>
      </div>
    </div>
  );
}
