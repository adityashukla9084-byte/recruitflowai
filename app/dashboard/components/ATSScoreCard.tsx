type ATSScoreCardProps = {
  score: number;
};

export default function ATSScoreCard({
  score,
}: ATSScoreCardProps) {
  const color =
    score >= 80
      ? "text-green-400"
      : score >= 60
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="rounded-2xl border border-theme-border-card bg-theme-bg-secondary p-6 shadow-lg shadow-[var(--shadow-card)]">

      <h2 className="text-lg font-semibold text-theme-text-secondary">
        ATS Score
      </h2>

      <div className={`mt-5 text-6xl font-bold ${color}`}>
        {score}
      </div>

      <div className="mt-2 text-theme-text-secondary">
        out of 100
      </div>

      <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-slate-700">

        <div
          className="h-full rounded-full bg-cyan-500 transition-all duration-700"
          style={{
            width: `${score}%`,
          }}
        />

      </div>

      <div className="mt-3 text-right text-sm text-theme-text-secondary">
        {score}% ATS Compatible
      </div>

    </div>
  );
}