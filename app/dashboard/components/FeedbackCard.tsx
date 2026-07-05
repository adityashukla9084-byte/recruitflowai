type FeedbackCardProps = {
  feedback: string;
};

export default function FeedbackCard({
  feedback,
}: FeedbackCardProps) {
  return (
    <div className="rounded-2xl border border-cyan-800 bg-slate-900 p-6 shadow-lg">

      <h2 className="mb-4 text-xl font-bold text-cyan-400">
        👨‍💼 Recruiter Feedback
      </h2>

      <p className="leading-8 text-slate-300">
        {feedback}
      </p>

    </div>
  );
}