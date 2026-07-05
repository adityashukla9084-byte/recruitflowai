type ResumeRewriteCardProps = {
  rewrittenSummary: string;
};

export default function ResumeRewriteCard({
  rewrittenSummary,
}: ResumeRewriteCardProps) {
  return (
    <div className="rounded-2xl border border-cyan-700 bg-slate-900 p-6 shadow-lg">

      <h2 className="mb-4 text-xl font-bold text-cyan-400">
        ✨ AI Optimized Summary
      </h2>

      <p className="leading-8 text-slate-300">
        {rewrittenSummary}
      </p>

    </div>
  );
}