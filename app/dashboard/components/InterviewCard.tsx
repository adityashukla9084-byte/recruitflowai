type InterviewCardProps = {
  questions: string[];
};

export default function InterviewCard({ questions }: InterviewCardProps) {
  return (
    <div className="bg-theme-card border border-theme-border rounded-2xl p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 relative overflow-hidden group">
      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-theme-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-theme-text-muted mb-4 select-none">
        Interview Prep Questions
      </h3>
      <ol className="space-y-3">
        {questions.map((question, index) => (
          <li
            key={index}
            className="flex gap-3 text-sm text-theme-text-secondary leading-relaxed"
          >
            <span
              className="shrink-0 tabular-nums text-xs font-semibold text-theme-text-muted mt-0.5 w-5 text-right"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}.
            </span>
            <span>{question}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
