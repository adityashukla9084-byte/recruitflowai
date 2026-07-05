type WeaknessCardProps = {
  weaknesses: string[];
};

export default function WeaknessCard({
  weaknesses,
}: WeaknessCardProps) {
  return (
    <div className="rounded-2xl border border-red-800 bg-slate-900 p-6">

      <h2 className="mb-5 text-xl font-bold text-red-400">
        Weaknesses
      </h2>

      <ul className="space-y-3">
        {weaknesses.map((item, index) => (
          <li
            key={index}
            className="rounded-lg bg-slate-800 p-3"
          >
            ❌ {item}
          </li>
        ))}
      </ul>

    </div>
  );
}