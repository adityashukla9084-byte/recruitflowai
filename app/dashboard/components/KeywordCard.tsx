type KeywordCardProps = {
  matchedKeywords: string[];
  missingKeywords: string[];
};

export default function KeywordCard({
  matchedKeywords,
  missingKeywords,
}: KeywordCardProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">

      <div className="rounded-2xl border border-green-800 bg-theme-bg-secondary p-6 shadow-lg shadow-[var(--shadow-card)]">
        <h2 className="mb-5 text-xl font-bold text-green-400">
          ✅ Matched Keywords
        </h2>

        <div className="flex flex-wrap gap-3">
          {matchedKeywords.map((keyword, index) => (
            <span
              key={index}
              className="rounded-full bg-green-500/20 px-4 py-2 text-sm font-medium text-green-300"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-red-800 bg-theme-bg-secondary p-6 shadow-lg shadow-[var(--shadow-card)]">
        <h2 className="mb-5 text-xl font-bold text-red-400">
          ❌ Missing Keywords
        </h2>

        <div className="flex flex-wrap gap-3">
          {missingKeywords.map((keyword, index) => (
            <span
              key={index}
              className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}