type SummaryCardProps = {
  summary: string;
};

export default function SummaryCard({
  summary,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-theme-border-card bg-theme-bg-secondary p-6 shadow-lg shadow-[var(--shadow-card)]">

      <h2 className="mb-4 text-xl font-bold text-theme-accent">
        AI Resume Summary
      </h2>

      <p className="leading-8 text-zinc-300">
        {summary}
      </p>

    </div>
  );
}
