type ResumeHealthProps = {
  grammarScore: number;
  formattingScore: number;
  readabilityScore: number;
  achievementsScore: number;
};

export default function ResumeHealth({
  grammarScore,
  formattingScore,
  readabilityScore,
  achievementsScore,
}: ResumeHealthProps) {
  const average = Math.round(
    (grammarScore +
      formattingScore +
      readabilityScore +
      achievementsScore) / 4
  );

  const status =
    average >= 85
      ? "Excellent"
      : average >= 70
      ? "Good"
      : average >= 50
      ? "Average"
      : "Needs Improvement";

  const color =
    average >= 85
      ? "text-green-400"
      : average >= 70
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="rounded-2xl border border-theme-border-card bg-theme-bg-secondary p-6 shadow-lg shadow-[var(--shadow-card)]">

      <h2 className="text-lg font-semibold text-theme-text-secondary">
        Resume Health
      </h2>

      <h1 className={`mt-4 text-4xl font-bold ${color}`}>
        {status}
      </h1>

      <div className="mt-6 space-y-4">

        <HealthBar title="Grammar" value={grammarScore} />

        <HealthBar title="Formatting" value={formattingScore} />

        <HealthBar title="Readability" value={readabilityScore} />

        <HealthBar title="Achievements" value={achievementsScore} />

      </div>

    </div>
  );
}

function HealthBar({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div>

      <div className="mb-1 flex justify-between text-sm">

        <span>{title}</span>

        <span>{value}%</span>

      </div>

      <div className="h-2 rounded-full bg-slate-700">

        <div
          className="h-2 rounded-full bg-theme-accent"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}