type SuggestionCardProps = {
  suggestions: string[];
};

export default function SuggestionCard({
  suggestions,
}: SuggestionCardProps) {
  return (
    <div className="rounded-2xl border border-yellow-700 bg-slate-900 p-6">

      <h2 className="mb-5 text-xl font-bold text-yellow-400">
        AI Suggestions
      </h2>

      <ul className="space-y-3">
        {suggestions.map((item, index) => (
          <li
            key={index}
            className="rounded-lg bg-slate-800 p-3"
          >
            💡 {item}
          </li>
        ))}
      </ul>

    </div>
  );
}