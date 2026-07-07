type ResumeRewriteCardProps = {
  rewrittenSummary: string;
};

export default function ResumeRewriteCard({
  rewrittenSummary,
}: ResumeRewriteCardProps) {
  return (
    <div className="rounded-2xl border border-cyan-700 bg-theme-bg-secondary p-6 shadow-lg shadow-[var(--shadow-card)]">

      <h2 className="mb-4 text-xl font-bold text-cyan-400">
        ✨ AI Optimized Summary
      </h2>

      <p className="leading-8 text-slate-300">
        {rewrittenSummary}
      </p>

    </div>
  );
}