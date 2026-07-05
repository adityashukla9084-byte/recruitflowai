type SummaryCardProps = {
  summary: string;
};

export default function SummaryCard({
  summary,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

      <h2 className="mb-4 text-xl font-bold text-cyan-400">
        AI Resume Summary
      </h2>

      <p className="leading-8 text-slate-300">
        {summary}
      </p>

    </div>
  );
}