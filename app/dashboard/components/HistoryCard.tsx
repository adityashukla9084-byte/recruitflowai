type HistoryCardProps = {
  date: string;
  score: number;
};

export default function HistoryCard({
  date,
  score,
}: HistoryCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-900 p-4 shadow-lg border border-slate-800">

      <div>
        <p className="font-semibold text-white">
          Resume Analysis
        </p>

        <p className="text-sm text-slate-400">
          {date}
        </p>
      </div>

      <div className="text-2xl font-bold text-cyan-400">
        {score}/100
      </div>

    </div>
  );
}