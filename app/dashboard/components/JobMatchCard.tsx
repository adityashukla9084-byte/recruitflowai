type JobMatchCardProps = {
  matchScore: number;
};

export default function JobMatchCard({
  matchScore,
}: JobMatchCardProps) {
  return (
    <div className="rounded-2xl border border-blue-700 bg-theme-bg-secondary p-6 shadow-lg shadow-[var(--shadow-card)]">

      <h2 className="text-xl font-bold text-blue-400">
        🎯 Job Match Score
      </h2>

      <h1 className="mt-6 text-6xl font-bold text-theme-accent">
        {matchScore}%
      </h1>

      <div className="mt-6 h-3 rounded-full bg-slate-700">

        <div
          className="h-3 rounded-full bg-cyan-500"
          style={{
            width: `${matchScore}%`,
          }}
        />

      </div>

    </div>
  );
}