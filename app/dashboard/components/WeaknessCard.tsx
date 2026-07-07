type WeaknessCardProps = {
  weaknesses: string[];
};

export default function WeaknessCard({
  weaknesses,
}: WeaknessCardProps) {
  return (
    <div className="rounded-2xl border border-red-800 bg-theme-bg-secondary p-6 shadow-[var(--shadow-card)]">

      <h2 className="mb-5 text-xl font-bold text-red-400">
        Weaknesses
      </h2>

      <ul className="space-y-3">
        {weaknesses.map((item, index) => (
          <li
            key={index}
            className="rounded-lg bg-theme-card-hover p-3"
          >
            ❌ {item}
          </li>
        ))}
      </ul>

    </div>
  );
}