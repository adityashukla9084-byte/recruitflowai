type FeedbackCardProps = {
  feedback: string;
};

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <div className="bg-theme-card border border-theme-border rounded-2xl p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300  hover:scale-[1.005] cursor-default relative overflow-hidden group">
      
      {/* Subtle indicator accent line on the left side of card */}
      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-theme-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <h3 className="text-[11px] font-bold uppercase tracking-widest text-theme-text-muted mb-3 select-none">
        Recruiter Feedback
      </h3>
      <p className="text-sm text-theme-text-secondary leading-7 select-all">{feedback}</p>
    </div>
  );
}
