type InterviewCardProps = {
  questions: string[];
};

export default function InterviewCard({
  questions,
}: InterviewCardProps) {
  return (
    <div className="rounded-2xl border border-purple-700 bg-slate-900 p-6 shadow-lg">

      <h2 className="mb-5 text-xl font-bold text-purple-400">
        🎤 AI Interview Questions
      </h2>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div
            key={index}
            className="rounded-xl bg-slate-800 p-4"
          >
            <span className="font-bold text-cyan-400">
              Q{index + 1}.
            </span>{" "}
            {question}
          </div>
        ))}
      </div>

    </div>
  );
}