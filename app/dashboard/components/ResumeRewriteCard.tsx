type ResumeRewriteCardProps = {
  rewrittenSummary: string;
};

export default function ResumeRewriteCard({
  rewrittenSummary,
}: ResumeRewriteCardProps) {
  return (
    <div className="rounded-2xl border border-theme-border bg-theme-bg-secondary p-6 shadow-lg shadow-[var(--shadow-card)]">

      <h2 className="mb-4 text-xl font-bold text-[#D4AF37]">
        ✨ AI Optimized Summary
      </h2>

      <p className="leading-8 text-zinc-300">
        {rewrittenSummary}
      </p>

    </div>
  );
}