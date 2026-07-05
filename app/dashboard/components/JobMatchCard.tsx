type JobMatchCardProps = {
  matchScore: number;
};

export default function JobMatchCard({
  matchScore,
}: JobMatchCardProps) {
  return (
    <div className="rounded-2xl border border-blue-700 bg-slate-900 p-6 shadow-lg">

      <h2 className="text-xl font-bold text-blue-400">
        🎯 Job Match Score
      </h2>

      <h1 className="mt-6 text-6xl font-bold text-cyan-400">
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