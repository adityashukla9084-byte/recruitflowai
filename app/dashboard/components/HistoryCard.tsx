type HistoryCardProps = {
  date: string;
  score: number;
};

export default function HistoryCard({
  date,
  score,
}: HistoryCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-theme-bg-secondary p-4 shadow-lg shadow-[var(--shadow-card)] border border-theme-border-card">

      <div>
        <p className="font-semibold text-theme-text">
          Resume Analysis
        </p>

        <p className="text-sm text-theme-text-secondary">
          {date}
        </p>
      </div>

      <div className="text-2xl font-bold text-theme-accent">
        {score}/100
      </div>

    </div>
  );
}