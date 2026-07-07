type InterviewCardProps = {
  questions: string[];
};

export default function InterviewCard({
  questions,
}: InterviewCardProps) {
  return (
    <div className="rounded-2xl border border-purple-700 bg-theme-bg-secondary p-6 shadow-lg shadow-[var(--shadow-card)]">

      <h2 className="mb-5 text-xl font-bold text-purple-400">
        🎤 AI Interview Questions
      </h2>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div
            key={index}
            className="rounded-xl bg-theme-card-hover p-4"
          >
            <span className="font-bold text-theme-accent">
              Q{index + 1}.
            </span>{" "}
            {question}
          </div>
        ))}
      </div>

    </div>
  );
}