type StrengthCardProps = {
  strengths: string[];
};

export default function StrengthCard({
  strengths,
}: StrengthCardProps) {
  return (
    <div className="rounded-2xl border border-green-800 bg-theme-bg-secondary p-6 shadow-[var(--shadow-card)]">

      <h2 className="mb-5 text-xl font-bold text-green-400">
        Strengths
      </h2>

      <ul className="space-y-3">
        {strengths.map((item, index) => (
          <li
            key={index}
            className="rounded-lg bg-theme-card-hover p-3"
          >
            ✅ {item}
          </li>
        ))}
      </ul>

    </div>
  );
}